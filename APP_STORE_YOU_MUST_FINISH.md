# App Store — What Only You Can Finish

Code for the rejection fixes is on `cursor/verify-appstore-fixes-431b` (build **4**). An agent cannot archive the IPA or submit to App Store Connect from Windows.

## 1. Backend (15–30 min) — do before Mac archive

1. Supabase Dashboard → Edge Functions → Secrets:
   - `AUTO_PUBLISH_SECRET` = a strong random string (same value in GitHub Actions secrets)
   - `GEMINI_API_KEY`
   - `ALLOWED_ORIGINS` = `https://theclimatenote.com,https://www.theclimatenote.com,capacitor://localhost,ionic://localhost`
2. Deploy functions + migration (merge this branch to `main` or run **Deploy Supabase Edge Functions** workflow). Confirm `20260717000000_auto_create_user_profile` is applied.
3. GitHub → Settings → Secrets → Actions: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `AUTO_PUBLISH_SECRET`, `SUPABASE_PROJECT_REF`, `SUPABASE_ACCESS_TOKEN`
4. Manually publish **today’s** article if you want “today” content (fallback to latest already works; latest published article was `2026-02-18` at last probe).
5. Create demo account for Apple review (confirmed email/password + `user_profiles` row + ideally 1 note/streak).

Verify:

```bash
APP_REVIEW_EMAIL=... APP_REVIEW_PASSWORD=... npm run verify:appstore
```

Partial check without demo creds: `npm run verify:appstore -- --partial`

## 2. Mac archive (required)

```bash
npm run build:prod
npx cap sync ios
cd ios/App && pod install
# Xcode → open App.xcworkspace → Archive build 4 → Upload to App Store Connect
```

Never ship if cold launch shows Connection Error or Demo Mode.

## 3. Physical iPhone / TestFlight smoke test

- [ ] Demo email/password → Home article within a few seconds (no infinite spinner)
- [ ] Google → **in-app** Safari View Controller sheet only (not Safari.app)
- [ ] Apple → native sheet
- [ ] Profile → Delete account on a **throwaway** account (type `DELETE`)
- [ ] Privacy/Terms open in-app

## 4. App Store Connect

1. Select **build 4**
2. Paste reply from [`APP_STORE_REVIEW_REPLY.md`](APP_STORE_REVIEW_REPLY.md)
3. App Review Information: demo email + password
4. Confirm Privacy Policy URL loads: https://yasho1225.github.io/climatenote/privacy
5. Submit for review

## Not blockers for submission

- Auto-publish GitHub Action failing: does **not** block review if a published article already exists (it does). Still fix secrets so daily publish works.
