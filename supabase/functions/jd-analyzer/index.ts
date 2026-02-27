import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { jobDescription } = await req.json();
    if (!jobDescription) {
      return new Response(JSON.stringify({ error: "Job description is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const [instructionsRes, experiencesRes, skillsRes] = await Promise.all([
      supabase.from("ai_instructions").select("*"),
      supabase.from("experiences").select("*").order("sort_order"),
      supabase.from("skills").select("*").order("sort_order"),
    ]);

    const jdPromptRow = (instructionsRes.data || []).find((r: any) => r.key === "jd_analyzer_prompt");
    let systemPrompt = jdPromptRow?.value || "Analyze this job description for fit.";

    const expContext = (experiencesRes.data || []).map((e: any) =>
      `${e.company} (${e.date_range}) - ${e.title_progression}: ${(e.achievements || []).join("; ")}`
    ).join("\n");
    const skillsContext = (skillsRes.data || []).map((s: any) => `${s.name} (${s.category})`).join(", ");

    systemPrompt += `\n\nMY EXPERIENCE:\n${expContext}\n\nMY SKILLS: ${skillsContext}`;

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
          { role: "user", content: `Analyze this job description and return ONLY valid JSON:\n\n${jobDescription}` },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "analyze_fit",
              description: "Return a structured fit analysis for the job description",
              parameters: {
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
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "analyze_fit" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded." }), {
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
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call in response");

    const result = JSON.parse(toolCall.function.arguments);

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
