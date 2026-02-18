import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { article_title, article_subtitle, key_takeaways, article_content } = await req.json();

    const geminiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiKey) {
      return new Response(
        JSON.stringify({ error: 'Gemini API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build context from article
    const takeawayText = key_takeaways?.length
      ? `Key takeaways:\n${key_takeaways.map((t: string) => `- ${t}`).join('\n')}`
      : '';

    // Truncate content to keep tokens low
    const contentSnippet = article_content
      ? article_content.replace(/<[^>]*>/g, '').substring(0, 800)
      : '';

    const prompt = `You are an environmental action coach for teenagers. You generate short, specific, realistic action ideas. Always respond with only a valid JSON array of exactly 3 strings.

Article title: "${article_title}"
${article_subtitle ? `Subtitle: "${article_subtitle}"` : ''}
${takeawayText}
${contentSnippet ? `Article excerpt: ${contentSnippet}` : ''}

Based on this environmental article, generate exactly 3 specific, personal action suggestions for a teenager. Each suggestion must:
- Be one sentence
- Start with "I will" or "I'll"
- Be specific and realistic (something they can actually do this week)
- Be directly related to the article topic

Return ONLY a valid JSON array of exactly 3 strings. No explanation, no markdown, just the JSON array.
Example format: ["I will...", "I'll...", "I will..."]`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 200,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini error: ${response.status}`);
    }

    const data = await response.json();
    const raw = data.candidates[0].content.parts[0].text.trim();

    // Strip markdown code fences if present
    const cleaned = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();

    // Parse and validate
    const suggestions = JSON.parse(cleaned);
    if (!Array.isArray(suggestions) || suggestions.length !== 3) {
      throw new Error('Invalid suggestions format');
    }

    return new Response(
      JSON.stringify({ suggestions }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Error generating suggestions:', err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
