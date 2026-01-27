# Article Scheduling System Setup Guide

This guide will help you set up automatic article publishing that runs daily at midnight CST (China Standard Time).

## Overview

The system consists of:
1. **Database Migration**: Adds scheduling columns to articles table
2. **Edge Function**: Publishes articles automatically
3. **GitHub Actions**: Triggers the Edge Function daily at midnight CST

---

## Part 1: Apply Database Migration (5 minutes)

### Option A: Using Supabase CLI (Recommended)

1. **Install Supabase CLI** (if not already installed):
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**:
   ```bash
   supabase login
   ```

3. **Link your project**:
   ```bash
   supabase link --project-ref your-project-ref
   ```
   (Find project-ref in Supabase Dashboard → Settings → General)

4. **Apply the migration**:
   ```bash
   supabase db push
   ```

### Option B: Using Supabase Dashboard (Manual)

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Go to **SQL Editor** in left sidebar
4. Click **New Query**
5. Open the file: `supabase/migrations/20250127000000_add_article_scheduling.sql`
6. Copy the entire contents
7. Paste into Supabase SQL Editor
8. Click **Run**
9. You should see: "Success. No rows returned"

### Verify Migration

Run this query in SQL Editor to verify:
```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'articles'
AND column_name IN ('scheduled_publish_date', 'auto_publish', 'scheduled_at');
```

You should see 3 rows returned with these columns.

---

## Part 2: Deploy Edge Function (10 minutes)

### Step 1: Install Supabase CLI (if not done above)

```bash
npm install -g supabase
```

### Step 2: Login and Link Project

```bash
supabase login
supabase link --project-ref your-project-ref
```

### Step 3: Deploy the Edge Function

```bash
supabase functions deploy auto-publish-articles
```

This will:
- Upload the function code to Supabase
- Make it available at: `https://your-project-ref.supabase.co/functions/v1/auto-publish-articles`

### Step 4: Test the Edge Function

Test it manually to ensure it works:

```bash
curl -X POST \
  "https://your-project-ref.supabase.co/functions/v1/auto-publish-articles" \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json"
```

Expected response:
```json
{
  "success": true,
  "message": "No articles scheduled for today",
  "date": "2025-01-27",
  "published_count": 0
}
```

---

## Part 3: Configure GitHub Actions (10 minutes)

### Step 1: Add GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add two secrets:

**Secret 1:**
- Name: `SUPABASE_URL`
- Value: `https://your-project-ref.supabase.co`
- (Find in Supabase Dashboard → Settings → API → Project URL)

**Secret 2:**
- Name: `SUPABASE_ANON_KEY`
- Value: `your_anon_key_here`
- (Find in Supabase Dashboard → Settings → API → Project API keys → `anon` `public`)

### Step 2: Enable GitHub Actions

1. Go to your GitHub repository
2. Click **Actions** tab
3. If prompted, click **I understand my workflows, go ahead and enable them**
4. You should see the workflow: "Auto-Publish Scheduled Articles"

### Step 3: Test the Workflow Manually

1. In **Actions** tab, click on **Auto-Publish Scheduled Articles**
2. Click **Run workflow** dropdown (top right)
3. Click **Run workflow** button
4. Wait ~30 seconds, then refresh
5. Click on the workflow run to see logs
6. You should see: "✅ Auto-publish completed successfully!"

---

## Part 4: Using the Scheduling System

### For Admins: How to Schedule Articles

Once the admin calendar UI is built (coming in next phase), you'll be able to:

1. **Create or Edit Article**
2. **Set Scheduled Publish Date**: Pick a future date
3. **Enable Auto-Publish**: Toggle ON
4. **Save Article**

The article will automatically publish at midnight CST on the scheduled date.

### Manual Publishing (Current Behavior)

If you don't want auto-publishing:
- Leave **Auto-Publish** toggle OFF
- Manually click "Publish" when ready

### Checking Scheduled Articles

In the admin panel, you'll see:
- 📅 Scheduled date
- 🤖 Auto-publish status
- ⏰ Time until publish

---

## Part 5: Monitoring and Troubleshooting

### Check GitHub Actions Logs

1. Go to **Actions** tab in GitHub
2. Click on any workflow run
3. Click **Trigger Auto-Publish Edge Function**
4. See detailed logs

### Check Supabase Edge Function Logs

1. Go to Supabase Dashboard
2. Click **Edge Functions** in left sidebar
3. Click **auto-publish-articles**
4. Click **Logs** tab
5. See function execution logs

### Check Published Articles

Run this query in Supabase SQL Editor:
```sql
SELECT
  title,
  scheduled_publish_date,
  auto_publish,
  is_published,
  status,
  published_date
FROM articles
WHERE auto_publish = true
ORDER BY scheduled_publish_date DESC
LIMIT 10;
```

---

## Troubleshooting

### Edge Function Not Deploying

**Error**: "Authentication failed"
```bash
# Re-login and link project
supabase logout
supabase login
supabase link --project-ref your-project-ref
```

**Error**: "Function already exists"
```bash
# Update existing function
supabase functions deploy auto-publish-articles --no-verify-jwt
```

### GitHub Actions Not Running

**Issue**: Workflow doesn't trigger at midnight

- GitHub Actions cron can have delays up to 15 minutes during high load
- Scheduled workflows only run on the default branch (usually `main`)
- Check if Actions are enabled: Settings → Actions → General → Allow all actions

**Issue**: Workflow fails with 401 Unauthorized

- Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY` are set correctly in GitHub Secrets
- Make sure the anon key is the `public` one, not the `service_role` key

### Articles Not Publishing

**Check 1**: Verify article meets criteria
```sql
SELECT id, title, status, auto_publish, is_published, scheduled_publish_date
FROM articles
WHERE scheduled_publish_date = CURRENT_DATE
AND auto_publish = true;
```

Should return articles that match today's date (CST).

**Check 2**: Verify Edge Function is working
```bash
# Test the function manually
curl -X POST "https://your-project-ref.supabase.co/functions/v1/auto-publish-articles" \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

**Check 3**: Check article status
- Article must have `status = 'approved'` to auto-publish
- Article must have `is_published = false`
- Article must have `auto_publish = true`

### Timezone Issues

**Articles publishing at wrong time**

The system uses CST (UTC+8). Verify:
```sql
SELECT NOW() AT TIME ZONE 'Asia/Shanghai' as cst_time;
```

If you need a different timezone, edit:
- `.github/workflows/auto-publish-articles.yml` (line with cron schedule)
- `supabase/functions/auto-publish-articles/index.ts` (cstOffset variable)

---

## Testing the Complete System

### Create a Test Article

1. **Login as admin**
2. **Create article** with:
   - Title: "Test Auto-Publish"
   - Status: "approved"
   - Auto-publish: ON
   - Scheduled date: Tomorrow's date
3. **Save article**

### Wait Until Tomorrow Midnight CST

The GitHub Actions workflow will run automatically.

### Verify After Midnight

Run this query:
```sql
SELECT title, is_published, published_date, status
FROM articles
WHERE title = 'Test Auto-Publish';
```

Should show `is_published = true` and `published_date = tomorrow's date`.

---

## Cost Analysis

✅ **GitHub Actions**: FREE
- 2,000 minutes/month for private repos
- Unlimited for public repos
- This workflow uses <1 minute per day = ~30 minutes/month

✅ **Supabase Edge Functions (Free Tier)**: FREE
- 500,000 invocations/month
- We use 1 invocation/day = 30/month
- Well within free limits

✅ **Database Storage**: FREE
- Added 3 columns (negligible space)

**Total Cost: $0/month** 🎉

---

## Next Steps

After completing this setup:

1. ✅ Test the Edge Function manually
2. ✅ Test GitHub Actions workflow
3. ✅ Create test article for tomorrow
4. ✅ Verify auto-publish works
5. ⬜ Build admin calendar UI (next phase)
6. ⬜ Add scheduling UI to admin panel

---

## Security Notes

🔒 **Service Role Key**:
- The Edge Function uses `SUPABASE_SERVICE_ROLE_KEY` (automatically available in Edge Functions)
- This bypasses RLS policies to publish articles
- Never expose this key in client-side code

🔒 **Anon Key**:
- Safe to use in GitHub Actions (it's public)
- RLS policies still apply

---

## Support

If you encounter issues:

1. Check GitHub Actions logs
2. Check Supabase Edge Function logs
3. Test Edge Function manually with curl
4. Verify database migration applied correctly
5. Check that articles have correct status and dates

Need help? Let me know which step is failing and I'll assist!
