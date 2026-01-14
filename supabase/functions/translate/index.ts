import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, texts, targetLanguage, batch } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("Translation service not configured");
    }

    // Batch translation mode
    if (batch && texts) {
      const textsToTranslate = Object.entries(texts)
        .filter(([_, value]) => value != null && value !== "")
        .map(([key, value]) => ({ key, value }));

      if (textsToTranslate.length === 0) {
        return new Response(
          JSON.stringify({ translations: texts }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const prompt = `Translate the following Italian texts to English. Return ONLY a valid JSON object with the same keys but translated values. Keep the tone friendly and natural. Do not add any explanation or markdown.

Input:
${JSON.stringify(Object.fromEntries(textsToTranslate.map(t => [t.key, t.value])), null, 2)}

Return JSON only:`;

      console.log("Batch translation request for keys:", textsToTranslate.map(t => t.key));

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            {
              role: "system",
              content: "You are a professional translator. Translate Italian to English accurately while keeping a friendly, natural tone. Return ONLY valid JSON without markdown formatting.",
            },
            { role: "user", content: prompt },
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("AI gateway error:", response.status, errorText);
        
        if (response.status === 429) {
          return new Response(
            JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
            { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        if (response.status === 402) {
          return new Response(
            JSON.stringify({ error: "Translation credits exhausted." }),
            { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        
        throw new Error("Translation failed");
      }

      const data = await response.json();
      let translatedContent = data.choices?.[0]?.message?.content?.trim() || "";
      
      // Clean up markdown if present
      translatedContent = translatedContent.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      
      console.log("AI response:", translatedContent.slice(0, 200));

      try {
        const translations = JSON.parse(translatedContent);
        // Merge with original texts (for null values)
        const result = { ...texts, ...translations };
        
        return new Response(
          JSON.stringify({ translations: result }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch (parseError) {
        console.error("Failed to parse translation response:", parseError);
        return new Response(
          JSON.stringify({ translations: texts }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Single text translation mode
    if (!text || !targetLanguage) {
      return new Response(
        JSON.stringify({ error: "Missing text or targetLanguage" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (targetLanguage === "it") {
      return new Response(
        JSON.stringify({ translatedText: text }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Single translation request:", text.slice(0, 50) + "...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: "You are a professional translator. Translate Italian to English accurately while keeping a friendly, natural tone. Return ONLY the translated text without any explanation or formatting.",
          },
          {
            role: "user",
            content: `Translate this Italian text to English:\n\n${text}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Translation credits exhausted" }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error("Translation failed");
    }

    const data = await response.json();
    const translatedText = data.choices?.[0]?.message?.content?.trim() || text;

    console.log("Translation complete");

    return new Response(
      JSON.stringify({ translatedText }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Translation error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Translation failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
