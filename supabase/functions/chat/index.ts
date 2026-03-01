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
    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    if (!ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY is not configured");

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

    // Enrich with profile context
    const profile = (profileRes.data || [])[0];
    const profileContext = profile
      ? `Name: ${profile.full_name}\nTitle: ${profile.title}\nPositioning: ${profile.positioning}\nStatus: ${profile.status_badge}\nCompanies: ${(profile.company_badges || []).join(", ")}`
      : "";

    // Enrich with FAQ, experience, and skills context
    const faqContext = (faqRes.data || []).map((f: any) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n");
    const expContext = (experiencesRes.data || []).map((e: any) =>
      `${e.company} (${e.date_range}) - ${e.title_progression}\nAchievements: ${(e.achievements || []).join("; ")}\nSituation: ${e.ai_situation}\nApproach: ${e.ai_approach}\nTechnical: ${e.ai_technical_work}\nLessons: ${e.ai_lessons_learned}`
    ).join("\n\n");
    const skillsContext = (skillsRes.data || []).map((s: any) => `${s.name}: ${s.category}${s.note ? ` (Note: ${s.note})` : ""}`).join(", ");

    systemPrompt += `\n\nCANDIDATE PROFILE:\n${profileContext}\n\nFAQ KNOWLEDGE:\n${faqContext}\n\nEXPERIENCE DETAILS:\n${expContext}\n\nSKILLS: ${skillsContext}`;

    // Filter out system messages from the user-provided messages and format for Anthropic
    const anthropicMessages = messages
      .filter((m: any) => m.role === "user" || m.role === "assistant")
      .map((m: any) => ({ role: m.role, content: m.content }));

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        system: systemPrompt,
        messages: anthropicMessages,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Anthropic API error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Transform Anthropic SSE stream to OpenAI-compatible SSE format
    // so the existing frontend streaming code works unchanged
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();

    (async () => {
      try {
        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          let newlineIdx: number;
          while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
            const line = buffer.slice(0, newlineIdx).trim();
            buffer = buffer.slice(newlineIdx + 1);

            if (!line.startsWith("data: ")) continue;
            const jsonStr = line.slice(6);

            try {
              const event = JSON.parse(jsonStr);

              if (event.type === "content_block_delta" && event.delta?.text) {
                // Convert to OpenAI-compatible SSE format
                const openAIChunk = {
                  choices: [{ delta: { content: event.delta.text } }],
                };
                await writer.write(encoder.encode(`data: ${JSON.stringify(openAIChunk)}\n\n`));
              }

              if (event.type === "message_stop") {
                await writer.write(encoder.encode("data: [DONE]\n\n"));
              }
            } catch {
              // Skip unparseable lines
            }
          }
        }

        // Ensure we send [DONE] even if message_stop wasn't received
        await writer.write(encoder.encode("data: [DONE]\n\n"));
      } catch (e) {
        console.error("Stream transform error:", e);
      } finally {
        await writer.close();
      }
    })();

    return new Response(readable, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
