import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Fetch system prompt and FAQ from database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const [instructionsRes, faqRes, experiencesRes, skillsRes] = await Promise.all([
      supabase.from("ai_instructions").select("*"),
      supabase.from("faq").select("*").order("sort_order"),
      supabase.from("experiences").select("*").order("sort_order"),
      supabase.from("skills").select("*").order("sort_order"),
    ]);

    const systemPromptRow = (instructionsRes.data || []).find((r: any) => r.key === "system_prompt");
    let systemPrompt = systemPromptRow?.value || "You are a helpful assistant.";

    // Enrich with FAQ context
    const faqContext = (faqRes.data || []).map((f: any) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n");
    const expContext = (experiencesRes.data || []).map((e: any) =>
      `${e.company} (${e.date_range}) - ${e.title_progression}\nAchievements: ${(e.achievements || []).join("; ")}\nSituation: ${e.ai_situation}\nApproach: ${e.ai_approach}\nTechnical: ${e.ai_technical_work}\nLessons: ${e.ai_lessons_learned}`
    ).join("\n\n");
    const skillsContext = (skillsRes.data || []).map((s: any) => `${s.name}: ${s.category}`).join(", ");

    systemPrompt += `\n\nFAQ KNOWLEDGE:\n${faqContext}\n\nEXPERIENCE DETAILS:\n${expContext}\n\nSKILLS: ${skillsContext}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits depleted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

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
