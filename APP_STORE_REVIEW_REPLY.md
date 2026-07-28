# App Store Review — Resubmission Notes

Use this when replying to rejection **Submission ID: 4cecb7f8-96bd-4617-a918-42c4c0f8c0f2**.

---

## Agent-completed (as of build-4 branch)

Code + automated checks already done on `cursor/verify-appstore-fixes-431b`:

- In-app auth (email first, Apple native, Google SFSafariViewController)
- Bounded Home/profile loading (no infinite spinner)
- Account deletion UI + hardened `delete-account` edge function source
- iOS `CURRENT_PROJECT_VERSION = 4`
- Unit tests (33) + `npm run build:prod` pass
- Live probe: auth OK, Google+Apple enabled, published articles exist, `delete-account` deployed (401 without user JWT)

Still broken/incomplete in production until you act:

- `auto-publish-articles` currently returns **HTTP 500** on probe — set `AUTO_PUBLISH_SECRET` in Supabase Edge Function secrets and redeploy (timezone fix is in this branch)
- Demo login not verified here — no `APP_REVIEW_EMAIL` / `APP_REVIEW_PASSWORD` in this environment
- IPA archive / App Store Connect / physical iPhone QA require your Mac + Apple account

---

## What we fixed in the new build

### Guideline 4 — Sign in inside the app
- **Email/password** is the primary auth path (shown first) and completes entirely within the app UI (no browser).
- **Sign in with Apple** uses the native iOS authorization sheet (`ASAuthorizationController`) — no Safari.
- **Google sign-in** uses the **Safari View Controller API** (`SFSafariViewController` via Capacitor Browser) so users stay inside the app and can verify the URL / SSL certificate. They are **not** sent to the external Safari app. If the in-app browser fails to open, the app shows an error and does not fall back to Safari.app.
- **Privacy & Terms** during sign-up open in-app screens, not Safari.

### Guideline 2.1(a) — Demo account infinite loading
- Auth and Dashboard network calls use **timeouts** so the UI cannot spin forever.
- Native splash hides immediately after shell init (does not wait on network).
- After sign-in, Home loads today’s published article, or **falls back to the latest published article** if today is missing — as **one bounded request** (not stacked waits).
- Loading spinners always clear (success, error, or timeout); Home/Archive show **Retry** on load errors.
- New users get a `user_profiles` row via a database trigger (plus client backup).
- Profile tab never blanks: shows retry + Delete account even if profile load fails.

### Guideline 5.1.1(v) — Account deletion
- **Profile tab → Delete account** (menu item)
- **Profile tab → Danger zone → Delete account** (secondary entry)
- **Profile & account modal → Delete account…**
- Delete remains available even if profile stats fail to load (uses session email).
- Flow: tap Delete account → type `DELETE` → confirm → account and data removed via server (client call is time-bounded).

---

## Paste into App Store Connect → Reply to App Review

```
Thank you for the feedback. We have updated build 4 to address both items:

Guideline 4 — Sign in / registration:
• Email and password registration and login are completed entirely within the app UI.
• Sign in with Apple uses the native iOS authorization sheet (ASAuthorizationController).
• Google sign-in uses the Safari View Controller API (SFSafariViewController) so authentication stays inside the app. Users are not taken to the external Safari app.
• Legal links on the sign-up screen open in-app policy screens.

Guideline 2.1(a) — Demo account loading:
• We fixed indefinite loading after demo credentials by bounding post-login article loading and ensuring the Home screen always finishes (article, empty state, or Retry).
• If today’s article is unavailable, the app falls back to the latest published article so reviewers are not left on a spinner.

Guideline 5.1.1(v) — Account deletion:
• Signed-in users can delete their account from Profile → "Delete account" (also under Danger zone).
• Deletion is permanent (not deactivation). Users type DELETE to confirm.
• Our backend edge function removes user notes, goals, profile, and the auth user.

How to test with the demo account (email/password):
1. Launch the app → Get started → Log in.
2. Enter the demo email and password from App Review Information.
3. Confirm Home loads an article (or Retry) within a few seconds — not an infinite spinner.
4. Optional: Profile → Delete account (use a throwaway account, not the shared demo).

Demo account (email/password):
Email: [YOUR_DEMO_EMAIL]
Password: [YOUR_DEMO_PASSWORD]
```

---

## Screen recording checklist (physical iPhone)

Record **2–3 minutes** showing:

1. Launch app → Get started → sign in with **demo email/password**
2. (Optional) Continue with Google → confirm **in-app Safari View Controller sheet**, not external Safari
3. Land on Home with an article (not an infinite spinner)
4. **Profile** tab (bottom nav)
5. Tap **Delete account** in the menu (red row)
6. Show confirmation screen — type `DELETE`
7. Tap **Permanently delete account** (use a throwaway test account if needed)

Upload the video to **App Store Connect → App Review Information → Notes** (or attach in your reply).

---

## Backend checklist (Supabase — before archiving IPA)

1. **Edge Function secrets** (Dashboard → Edge Functions → Secrets):
   - `GEMINI_API_KEY` — AI summaries work
   - `ALLOWED_ORIGINS` — include `capacitor://localhost`, `ionic://localhost` if needed

2. **Deploy functions** — GitHub Actions workflow `Deploy Supabase Edge Functions`:
   - Secret `SUPABASE_ACCESS_TOKEN` (single underscore)
   - Secret `SUPABASE_PROJECT_REF` = `noefayakyrmmknqlcklf`
   - Must include **`delete-account`** and migration `20260717000000_auto_create_user_profile`

3. **Publish at least one article** — Home falls back to latest if today is missing

4. **Demo account** for reviewers (put real credentials only in App Store Connect — not in this repo):
   - Email/password account that is **confirmed** (can sign in)
   - Row exists in `user_profiles`
   - Pre-seed: at least one note + visible streak so Home/Profile look complete
   - Verify: `APP_REVIEW_EMAIL=... APP_REVIEW_PASSWORD=... npm run verify:appstore`
   - Test on a physical iPhone: cold launch → demo login → Home within a few seconds (no infinite spinner)

5. **Apply migration** `20260717000000_auto_create_user_profile.sql` to production Supabase before review

---

## iOS archive (Mac)

1. `.env` with `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`
2. `npm run build:prod` → `npx cap sync ios` → `pod install` in `ios/App`
3. Xcode: **build number 4** → Archive → Upload
4. Never ship if launch shows Connection Error or Demo Mode

---

## Device QA (physical iPhone)

- [ ] Cold launch → demo email/password → Home with article within a few seconds
- [ ] Sign in with Google — **SFSafariViewController sheet only**, not Safari.app
- [ ] Sign in with Apple — native sheet, no Safari app
- [ ] Email sign-up / login in-app
- [ ] Profile → Delete account → type DELETE → success (throwaway account)
- [ ] No “Supabase env vars” text if AI fails
- [ ] Notebook → Report → in-app sheet → Send report

---

## App Store Connect resubmission

1. Select **build 4** (or latest uploaded build)
2. Reply to rejection (template above)
3. **App Review Information:** demo credentials + screen recording
4. **App Privacy:** email, name, user content; Gemini AI processing; **no tracking**
5. **Age rating:** disclose user-generated content (community notes) → likely 12+
6. **Privacy Policy URL:** https://yasho1225.github.io/climatenote/privacy (must load)
7. Submit for review

---

## Before you resubmit (quick)

1. `npm run build:prod` with real `.env`
2. `APP_REVIEW_EMAIL=... APP_REVIEW_PASSWORD=... npm run verify:appstore`
3. `npm run ios:build` on Mac → Archive → upload **build 4**
4. Test Google sign-in on device — must open in-app Safari View Controller, not Safari.app
5. Test demo login — no infinite spinner
6. Test delete account with throwaway email account
