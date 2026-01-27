// Auto-Publish Articles Edge Function
// Runs daily at midnight CST to publish scheduled articles

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client with admin privileges
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get today's date in CST (China Standard Time / UTC+8)
    const now = new Date()
    const cstOffset = 8 * 60 // CST is UTC+8
    const cstDate = new Date(now.getTime() + cstOffset * 60 * 1000)
    const todayCST = cstDate.toISOString().split('T')[0] // YYYY-MM-DD format

    console.log(`Running auto-publish for date: ${todayCST}`)

    // Find articles that should be published today
    const { data: articlesToPublish, error: fetchError } = await supabase
      .from('articles')
      .select('id, title, scheduled_publish_date')
      .eq('auto_publish', true)
      .eq('is_published', false)
      .eq('status', 'approved')
      .eq('scheduled_publish_date', todayCST)

    if (fetchError) {
      console.error('Error fetching articles:', fetchError)
      throw fetchError
    }

    if (!articlesToPublish || articlesToPublish.length === 0) {
      console.log('No articles to publish today')
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No articles scheduled for today',
          date: todayCST,
          published_count: 0
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    console.log(`Found ${articlesToPublish.length} articles to publish:`, articlesToPublish)

    // Publish each article
    const results = []
    for (const article of articlesToPublish) {
      const { data, error: updateError } = await supabase
        .from('articles')
        .update({
          is_published: true,
          status: 'published',
          published_date: todayCST,
          updated_at: new Date().toISOString()
        })
        .eq('id', article.id)
        .select()
        .single()

      if (updateError) {
        console.error(`Error publishing article ${article.id}:`, updateError)
        results.push({
          id: article.id,
          title: article.title,
          success: false,
          error: updateError.message
        })
      } else {
        console.log(`Successfully published article: ${article.title}`)
        results.push({
          id: article.id,
          title: article.title,
          success: true
        })
      }
    }

    const successCount = results.filter(r => r.success).length
    const failCount = results.filter(r => !r.success).length

    return new Response(
      JSON.stringify({
        success: true,
        message: `Published ${successCount} article(s) successfully`,
        date: todayCST,
        published_count: successCount,
        failed_count: failCount,
        results: results
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error in auto-publish function:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
