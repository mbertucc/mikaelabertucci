import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ─── In-memory rate limiter ───────────────────────────────────────────
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 30;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

// ─── Input validation constants ───────────────────────────────────────
const MAX_MESSAGES = 20;
const MAX_TOTAL_CHARS = 20000;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("cf-connecting-ip") || "unknown";
  if (!checkRateLimit(clientIp)) {
    return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
      status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "Messages array is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (messages.length > MAX_MESSAGES) {
      return new Response(JSON.stringify({ error: `Too many messages (max ${MAX_MESSAGES})` }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const totalChars = messages.reduce((sum: number, m: any) => sum + String(m.content ?? "").length, 0);
    if (totalChars > MAX_TOTAL_CHARS) {
      return new Response(JSON.stringify({ error: "Payload too large" }), {
        status: 413, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const validRoles = new Set(["user", "assistant"]);
    for (const m of messages) {
      if (!validRoles.has(m.role)) {
        return new Response(JSON.stringify({ error: `Invalid message role: ${m.role}` }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (typeof m.content !== "string") {
        return new Response(JSON.stringify({ error: "Message content must be a string" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    if (!OPENROUTER_API_KEY) throw new Error("OPENROUTER_API_KEY is not configured");

    // Fetch system prompt and context from database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const [instructionsRes, faqRes, experiencesRes, skillsRes, profileRes] = await Promise.all([
      supabase.from("ai_instructions").select("*"),
      supabase.from("faq").select("*").order("sort_order"),
      supabase.from("experiences").select("*").order("sort_order"),
      supabase.from("skills").select("*").order("sort_order"),
      supabase.from("profile").select("*").limit(1),
    ]);

    const systemPromptRow = (instructionsRes.data || []).find((r: any) => r.key === "system_prompt");
    let systemPrompt = systemPromptRow?.value || "You are a helpful assistant.";

    const profile = (profileRes.data || [])[0];
    const profileContext = profile
      ? `Name: ${profile.full_name}\nTitle: ${profile.title}\nEmail: ${profile.email || ""}\nPositioning: ${profile.positioning}\nStatus: ${profile.status_badge}\nCompanies: ${(profile.company_badges || []).join(", ")}`
      : "";

    const faqContext = (faqRes.data || []).map((f: any) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n");
    const expContext = (experiencesRes.data || []).map((e: any) =>
      `${e.company} (${e.date_range}) - ${e.title_progression}\nAchievements: ${(e.achievements || []).join("; ")}\nSituation: ${e.ai_situation}\nApproach: ${e.ai_approach}\nTechnical: ${e.ai_technical_work}\nLessons: ${e.ai_lessons_learned}`
    ).join("\n\n");
    const skillsContext = (skillsRes.data || []).map((s: any) => `${s.name}: ${s.category}${s.note ? ` (Note: ${s.note})` : ""}`).join(", ");

    systemPrompt += `\n\nCANDIDATE PROFILE:\n${profileContext}\n\nFAQ KNOWLEDGE:\n${faqContext}\n\nEXPERIENCE DETAILS:\n${expContext}\n\nSKILLS: ${skillsContext}`;

    const openRouterMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((m: any) => ({ role: m.role, content: m.content })),
    ];

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://mikaelabertucci.lovable.app",
        "X-Title": "Mikaela Bertucci Portfolio",
      },
      body: JSON.stringify({
        model: "anthropic/claude-sonnet-4",
        max_tokens: 1500,
        messages: openRouterMessages,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "API credits exhausted. Please add funds." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // OpenRouter returns OpenAI-compatible SSE — pass through directly
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
