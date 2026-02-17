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

    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
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

    const prompt = `Article title: "${article_title}"
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

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.8,
        max_tokens: 200,
        messages: [
          {
            role: 'system',
            content: 'You are an environmental action coach for teenagers. You generate short, specific, realistic action ideas. Always respond with only a valid JSON array of exactly 3 strings.',
          },
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI error: ${response.status}`);
    }

    const data = await response.json();
    const raw = data.choices[0].message.content.trim();

    // Parse and validate
    const suggestions = JSON.parse(raw);
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
