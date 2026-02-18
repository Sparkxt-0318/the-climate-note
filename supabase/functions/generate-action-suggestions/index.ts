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

    const prompt = `You are an environmental action coach for teenagers. Generate exactly 3 personal action commitments based on this specific article.

Article title: "${article_title}"
${article_subtitle ? `Subtitle: "${article_subtitle}"` : ''}
${takeawayText}
${contentSnippet ? `Article excerpt: ${contentSnippet}` : ''}

Rules for each suggestion:
- Start with "I will" or "I'll"
- Be SPECIFIC to this article's topic — mention the actual issue (e.g. fast fashion, microplastics, food waste)
- Be a concrete, real-world action (e.g. "I'll buy my next item of clothing secondhand instead of new" NOT "I'll make a change")
- Be realistic for a teenager — something doable at home, school, or when shopping
- Vary the suggestions: one small/immediate action, one medium effort, one bigger lifestyle shift
- Do NOT use vague phrases like "research more", "make a change", "track progress", "be more aware"
- Each action should name a specific behavior change

Good examples for a fast fashion article:
["I'll check a thrift store before buying new clothes next time I need something", "I will wash my synthetic clothes in a microplastic-catching laundry bag", "I'll go through my closet and donate clothes I haven't worn in 6 months instead of throwing them away"]

Bad examples (too vague — never do this):
["I will research more about fast fashion", "I'll make one small change in my daily routine", "I will track my progress for 7 days"]

Return ONLY a valid JSON array of exactly 3 strings. No explanation, no markdown.`;

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
