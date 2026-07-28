// Auto-Publish Articles Edge Function
// Runs daily at midnight America/Chicago to publish scheduled articles
// (aligned with src/lib/appTimezone.ts and gamification SQL).

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { writeAuditLog } from '../_shared/auditLog.ts'
import { createServiceClient } from '../_shared/auth.ts'
import { hasValidCronSecret } from '../_shared/requestGuards.ts'
import { getCorsHeaders, handleCorsPreflight } from '../_shared/cors.ts'
import { getClientIp, logSecurityEvent } from '../_shared/securityLog.ts'

const ENDPOINT = 'auto-publish-articles'
const APP_TIMEZONE = 'America/Chicago'

/** YYYY-MM-DD for "today" in America/Chicago (matches client getAppToday). */
function getAppTodayChicago(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: APP_TIMEZONE }).format(new Date())
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req)
  const preflight = handleCorsPreflight(req)
  if (preflight) return preflight

  const ip = getClientIp(req)

  try {
    const expectedSecret = Deno.env.get('AUTO_PUBLISH_SECRET')
    const providedSecret = req.headers.get('x-cron-secret')
    if (!hasValidCronSecret(providedSecret, expectedSecret)) {
      logSecurityEvent({
        endpoint: ENDPOINT,
        result: 'blocked',
        reason: 'invalid_cron_secret',
        ip,
      })
      return new Response(
        JSON.stringify({ success: false, error: 'Forbidden' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 403,
        }
      )
    }

    const supabase = createServiceClient()
    const todayApp = getAppTodayChicago()

    console.log(`Running auto-publish for date: ${todayApp} (${APP_TIMEZONE})`)

    // Atomic publish: one UPDATE avoids fetch-then-update races when cron overlaps.
    const { data: publishedArticles, error: updateError } = await supabase
      .from('articles')
      .update({
        is_published: true,
        status: 'published',
        published_date: todayApp,
        updated_at: new Date().toISOString(),
      })
      .eq('auto_publish', true)
      .eq('is_published', false)
      .eq('status', 'approved')
      .eq('scheduled_publish_date', todayApp)
      .select('id, title')

    if (updateError) {
      console.error('Error publishing articles:', updateError)
      throw updateError
    }

    const results = (publishedArticles ?? []).map((article) => ({
      id: article.id,
      title: article.title,
      success: true,
    }))

    if (results.length === 0) {
      console.log('No articles to publish today')
    } else {
      console.log(`Published ${results.length} article(s):`, results)
    }

    const successCount = results.length
    const failCount = 0

    await writeAuditLog(supabase, {
      action: 'auto_publish_articles',
      ip,
      metadata: { date: todayApp, timezone: APP_TIMEZONE, successCount, failCount },
    })

    logSecurityEvent({
      endpoint: ENDPOINT,
      result: 'allowed',
      reason: 'publish_complete',
      ip,
      metadata: { successCount, failCount },
    })

    return new Response(
      JSON.stringify({
        success: true,
        message: `Published ${successCount} article(s) successfully`,
        date: todayApp,
        timezone: APP_TIMEZONE,
        published_count: successCount,
        failed_count: failCount,
        results: results,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error in auto-publish function:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Auto-publish failed',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
