# Referral Rocket Integration

Sayso uses [Referral Rocket](https://app.referralrocket.io) (RR) for the refer-a-friend program. Users get a unique share link, and when a friend signs up + pays via Stripe, the referrer is credited automatically.

## End-to-end flow

1. **Alice** logs in, opens `/settings` → Referrals tab. The hook calls `addParticipant` then `getParticipantDetail` against the RR SDK and displays her share link: `https://app.asksayso.com/login?referralCode=XXXX`.
2. **Bob** clicks the link. The RR SDK (loaded via `index.html`) auto-reads `?referralCode=XXXX` from the URL and stores it in a cookie (60-day retention).
3. The login page detects `referralCode` in the URL and **auto-switches to the signup form** (instead of login).
4. Bob signs up. `AuthContext.signUp` fires `enrollReferralParticipant` after Supabase + DB account creation. The RR SDK reads the cookie and binds Bob's email to Alice as the referrer.
5. Bob pays via Stripe Checkout. Stripe's webhook fires → RR receives the event → RR matches Bob's customer email to the participant → Alice's "Reward Due" updates in the RR dashboard.
6. Reward payout happens via RR (manual approval on free plan, or auto-approve on Pro plan).

## Why no `qualifyParticipant` call?

RR's SDK has a `qualifyParticipant` method that you'd manually call on purchase. **We don't use it** because the Stripe integration is connected in RR — it handles purchase qualification via Stripe webhooks (email-match attribution). Calling both would risk double-counting.

## Key files

| File | Purpose |
| --- | --- |
| `index.html` | Loads the RR widget script (`campaign-id` from env var) |
| `src/services/referralRocket.ts` | `enrollReferralParticipant` helper — waits for SDK + calls `addParticipant`, swallows already-enrolled errors |
| `src/views/Settings/hooks/useReferralLink.ts` | Enrolls the current user and fetches their share link for the Settings UI |
| `src/views/Settings/components/SettingsReferralForm.tsx` | The "Refer a friend" UI in Settings |
| `src/hooks/useCanAccessReferrals.ts` | Gates the Referrals tab — individual users + team admins/superadmins only |
| `src/types/referralRocket.d.ts` | TypeScript declarations for `window.Rocket` and campaign methods |
| `src/context/AuthContext.tsx` | Fires `enrollReferralParticipant` on signup + on every auth bootstrap (covers existing users who log in via a referral link) |
| `src/views/Login/hooks/useLoginForm.tsx` | Auto-switches to signup form when `?referralCode=` is in the URL |

## Environment

`VITE_REFERRAL_ROCKET_CAMPAIGN_ID` — current value `jhFrHdRj`. Read by `index.html` at build time via Vite's `%VITE_*%` placeholder.

## RR dashboard configuration

- **Campaign destination URL:** `https://app.asksayso.com/login` (no query params — RR appends `?referralCode=XXX` cleanly).
- **Stripe integration:** Connected via OAuth in the RR dashboard. No code-side webhook setup needed.
- **Tracking method:** Email-match (RR matches Stripe customer emails to participants). Not promo-code.
- **Minimum spend:** 0 — any qualifying payment counts.
- **Auto-reward:** Gated behind RR Pro plan. On free plan, rewards must be manually approved in the RR dashboard.

## Access control

Only **individual users** and **team admins/superadmins** see the Referrals tab. Regular team members are blocked — they don't get their own referral link because rewards typically belong to the account owner. See `useCanAccessReferrals.ts`.

## How to test the full flow

1. Log in as Account A → `/settings` → Referrals → copy share link.
2. Open the link in a non-incognito browser tab.
3. Verify DevTools → Application → Cookies shows `rr_referral_code`.
4. Confirm the login page renders the signup form (not the login form).
5. Sign up with a fresh email as Account B.
6. In the RR dashboard → Affiliates → click Account A → her referral count goes from 0 to 1 and Account B appears as "referred by".
7. (Optional) Have Account B pay via Stripe (test mode or real). After Stripe fires the webhook to RR, Account A's "Reward Due" should reflect the conversion.

## Gotchas

- **Third-party cookies:** RR's cookie is set on `referralrocket.io`, which is third-party from `app.asksayso.com`. Incognito and Safari aggressively block third-party cookies — referrals may not attribute in those contexts. Test in regular Chrome.
- **Build-time env substitution:** The campaign ID is injected at build time. If a deploy is missing `VITE_REFERRAL_ROCKET_CAMPAIGN_ID`, the script tag will ship with a literal `%VITE_REFERRAL_ROCKET_CAMPAIGN_ID%` placeholder and the SDK won't initialize.
- **`addParticipant` is idempotent.** Already-enrolled errors are swallowed by `enrollReferralParticipant`. Safe to call multiple times per user (signup, every login, every Settings visit).
- **The double-`?` URL bug:** Don't put `?signup=true` or any query param in the RR campaign destination URL — RR blindly appends `?referralCode=XXX` and breaks the URL. Keep the destination URL clean; signup detection happens in `useLoginForm.tsx` based on `referralCode` being present.
