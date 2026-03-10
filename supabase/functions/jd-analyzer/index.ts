import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ─── In-memory rate limiter ───────────────────────────────────────────
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 20; // max requests per IP per window
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
const MAX_JD_LENGTH = 10000;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  // Rate limiting by IP
  const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("cf-connecting-ip") || "unknown";
  if (!checkRateLimit(clientIp)) {
    return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
      status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { jobDescription } = await req.json();

    // ─── Input validation ───────────────────────────────────────
    if (!jobDescription || typeof jobDescription !== "string") {
      return new Response(JSON.stringify({ error: "Job description is required and must be a string" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (jobDescription.length > MAX_JD_LENGTH) {
      return new Response(JSON.stringify({ error: `Job description too long (max ${MAX_JD_LENGTH} characters)` }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    if (!ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY is not configured");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const [instructionsRes, experiencesRes, skillsRes, profileRes] = await Promise.all([
      supabase.from("ai_instructions").select("*"),
      supabase.from("experiences").select("*").order("sort_order"),
      supabase.from("skills").select("*").order("sort_order"),
      supabase.from("profile").select("*").limit(1),
    ]);

    const jdPromptRow = (instructionsRes.data || []).find((r: any) => r.key === "jd_analyzer_prompt");
    const basePrompt = jdPromptRow?.value || "Analyze this job description for fit.";

    const profile = (profileRes.data || [])[0];
    const profileContext = profile
      ? `Name: ${profile.full_name}\nTitle: ${profile.title}\nPositioning: ${profile.positioning}\nStatus: ${profile.status_badge}`
      : "";

    const expContext = (experiencesRes.data || []).map((e: any) =>
      `${e.company} (${e.date_range}) - ${e.title_progression}: ${(e.achievements || []).join("; ")}`
    ).join("\n");
    const skillsContext = (skillsRes.data || []).map((s: any) => `${s.name} (${s.category})${s.note ? ` [Note: ${s.note}]` : ""}`).join(", ");

    const systemPrompt = `You are a Level 5 Intent Architect. Compare the JD and Resume with 100% grounding in the provided text. Only extract explicit requirements. Identify gaps clearly. Do not infer skills that aren't there.\n\n${basePrompt}\n\nCANDIDATE PROFILE:\n${profileContext}\n\nMY EXPERIENCE:\n${expContext}\n\nMY SKILLS: ${skillsContext}`;

    const toolSchema = {
      name: "analyze_fit",
      description: "Return a structured fit analysis for the job description",
      input_schema: {
        type: "object",
        properties: {
          verdict: { type: "string", enum: ["strong-fit", "worth-conversation", "not-your-person"] },
          verdictLabel: { type: "string", enum: ["Strong Fit", "Worth a Conversation", "Probably Not Your Person"] },
          opening: { type: "string", description: "First-person honest assessment paragraph" },
          gaps: { type: "array", items: { type: "string" }, description: "Specific gaps" },
          transfers: { type: "array", items: { type: "string" }, description: "Transferable skills" },
          recommendation: { type: "string", description: "First-person recommendation" },
        },
        required: ["verdict", "verdictLabel", "opening", "gaps", "transfers", "recommendation"],
      },
    };

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 4096,
        temperature: 0.0,
        system: systemPrompt,
        messages: [
          { role: "user", content: `Analyze this job description and return a structured fit analysis:\n\n${jobDescription}` },
        ],
        tools: [toolSchema],
        tool_choice: { type: "tool", name: "analyze_fit" },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("Anthropic API error:", response.status, t);
      throw new Error("Anthropic API error");
    }

    const data = await response.json();
    const toolBlock = data.content?.find((b: any) => b.type === "tool_use");
    if (!toolBlock) throw new Error("No tool_use block in response");

    const result = toolBlock.input;

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("jd-analyzer error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
