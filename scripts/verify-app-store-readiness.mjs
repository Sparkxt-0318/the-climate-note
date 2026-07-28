/**
 * Read-only App Store readiness checks against production Supabase.
 *
 * Usage:
 *   APP_REVIEW_EMAIL=... APP_REVIEW_PASSWORD=... node scripts/verify-app-store-readiness.mjs
 *
 * Never commit reviewer credentials. Credentials must come from process env.
 */
import { createClient } from '@supabase/supabase-js';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

function loadEnvFile() {
  const envPath = join(root, '.env');
  const values = { ...process.env };
  if (!existsSync(envPath)) return values;

  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    if (!(key in values)) values[key] = value;
  }
  return values;
}

function fail(message) {
  console.error(`\n❌ ${message}\n`);
  process.exit(1);
}

function ok(message) {
  console.log(`✅ ${message}`);
}

const env = loadEnvFile();
const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;
const reviewEmail = process.env.APP_REVIEW_EMAIL;
const reviewPassword = process.env.APP_REVIEW_PASSWORD;

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
  fail('VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY missing or placeholder in .env');
}

if (!reviewEmail || !reviewPassword) {
  fail(
    'APP_REVIEW_EMAIL and APP_REVIEW_PASSWORD must be set in the process environment. ' +
      'Demo-login verification did NOT pass. Example:\n' +
      '  APP_REVIEW_EMAIL=reviewer@example.com APP_REVIEW_PASSWORD=secret node scripts/verify-app-store-readiness.mjs',
  );
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

console.log('\nApp Store readiness checks…\n');

const settingsResponse = await fetch(`${supabaseUrl}/auth/v1/settings`, {
  headers: {
    apikey: supabaseAnonKey,
    Authorization: `Bearer ${supabaseAnonKey}`,
  },
});

if (!settingsResponse.ok) {
  fail(`Supabase auth settings returned ${settingsResponse.status}`);
}

const settings = await settingsResponse.json();
ok('Supabase auth settings reachable');
console.log(
  `   Providers — email: ${Boolean(settings.external?.email ?? true)}, ` +
    `google: ${Boolean(settings.external?.google)}, apple: ${Boolean(settings.external?.apple)}`,
);

const { data: articles, error: articlesError } = await supabase
  .from('articles')
  .select('id, title, published_date, is_published')
  .eq('is_published', true)
  .order('published_date', { ascending: false })
  .limit(1);

if (articlesError) {
  fail(`Published article query failed: ${articlesError.message}`);
}

if (!articles?.length) {
  fail('No published articles found. Home will show empty/Retry for reviewers.');
}

ok(
  `Published article available: "${articles[0].title}" (${articles[0].published_date})`,
);

const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
  email: reviewEmail,
  password: reviewPassword,
});

if (signInError || !signInData.session) {
  fail(
    `Demo account sign-in failed: ${signInError?.message || 'no session returned'}. ` +
      'Confirm the account exists, email is confirmed, and credentials match App Store Connect.',
  );
}

ok(`Demo account signed in: ${signInData.user?.email || reviewEmail}`);

const { data: profile, error: profileError } = await supabase
  .from('user_profiles')
  .select('id, email, streak, total_notes')
  .eq('id', signInData.user.id)
  .maybeSingle();

if (profileError) {
  fail(`Demo profile query failed: ${profileError.message}`);
}

if (!profile) {
  fail(
    'Demo account has no user_profiles row. Apply migration 20260717000000_auto_create_user_profile.sql.',
  );
}

ok(
  `Demo profile ready (streak=${profile.streak}, notes=${profile.total_notes})`,
);

await supabase.auth.signOut();
ok('Demo account signed out cleanly');

console.log('\n✅ App Store readiness checks passed.\n');
console.log('Next (on Mac): npm run ios:build → Archive build 4 → upload → reply in App Store Connect.\n');
