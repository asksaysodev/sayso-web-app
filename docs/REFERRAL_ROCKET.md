# Referral Rocket Integration

Sayso uses [Referral Rocket](https://app.referralrocket.io) (RR) for the refer-a-friend program. The campaign is "25/25" (Double sided): referrers get $25 off their next bill; referees get $25 off their first payment.

## Campaign config

| Field | Value |
| --- | --- |
| Campaign name | 25/25 (Refer a friend, Double sided) |
| Campaign ID | `ndjRTx0q` |
| Referrer reward | $25 Stripe customer balance credit (one-time) |
| Referee reward | $25 Stripe coupon applied at checkout (one-time) |
| Share URL | `https://app.asksayso.com/login` |

## End-to-end flow

1. **Alice** logs in, opens `/settings` → Referrals tab. The tab shows her unique share link: `https://app.asksayso.com/login?referralCode=XXXX`.
2. **Bob** clicks the link. The RR widget script (loaded in `index.html`) reads `?referralCode=XXXX` and stores it in a cookie (60-day retention). The login page auto-switches to the signup form.
3. Bob signs up. `AuthContext.signUp` fires the referral attribution chain:
   - `enrollReferralParticipant` — RR binds Bob's email to Alice via the cookie.
   - `getParticipantReferrer({email: bob})` — reads Bob's `referredByCode` and `referrerEmail` from RR.
   - `setReferralAttribution` — persists `referral_code_used` and `referrer_email` on Bob's `accounts` row.
4. Bob goes to checkout. `createCheckoutSession` reads `account.referral_code_used`. Because it's set, Stripe Checkout is created with `discounts: [{ coupon: STRIPE_REFEREE_COUPON_ID }]` — Bob sees $25 off automatically. No manual coupon entry needed.
5. Bob pays. Stripe fires `invoice.paid` (billing_reason: `subscription_create` or later `subscription_cycle` when trial ends). `maybeIssueReferralCredit` runs:
   - Finds Bob's account via `referral_code_used` + `referrer_email`.
   - Looks up Alice's `stripe_customer_id`.
   - Creates a `-$25` customer balance transaction on Alice's Stripe account (idempotency key: `referral-credit-{bob_account_id}`).
   - Sets `referral_credit_issued_at` on Bob's account row (prevents double-crediting).
6. Stripe auto-applies Alice's $25 credit to her next invoice.

## Why we don't use RR's "Issue Reward" feature

RR's dashboard has a manual "Issue Reward → Send Rewards with Stripe" button. We do NOT use it — our code handles credits automatically via Stripe's customer balance API. **Do not click "Issue Reward" in the RR dashboard** for any user, or they will receive a double credit ($50 instead of $25).

RR's role in our stack is attribution ledger only (tracking who referred whom). The actual money flow goes through our backend + Stripe.

## Key files

| File | Purpose |
| --- | --- |
| `index.html` | Loads the RR widget script (`campaign-id` from `VITE_REFERRAL_ROCKET_CAMPAIGN_ID` env var) |
| `src/services/referralRocket.ts` | `enrollReferralParticipant`, `getParticipantReferrer`, `getCampaign` |
| `src/services/setReferralAttribution.ts` | POST to server to persist referral attribution on the account |
| `src/context/AuthContext.tsx` | Fires the full attribution chain (enroll → get referrer → persist) at signup |
| `src/views/Settings/hooks/useReferralLink.ts` | Fetches the user's share link for the Settings UI |
| `src/views/Settings/components/SettingsReferralForm.tsx` | "Refer a friend" UI in Settings |
| `src/hooks/useCanAccessReferrals.ts` | Gates the Referrals tab — individual users + team admins/superadmins only |
| `src/types/referralRocket.d.ts` | TypeScript declarations for `window.Rocket` |
| `server/controllers/account.controller.js` | `setReferralAttribution` endpoint (POST /accounts/referral-attribution) |
| `server/controllers/payment.controller.js` | `createCheckoutSession` (applies coupon), `maybeIssueReferralCredit` (credits referrer) |
| `server/db/migrations/007_referral_attribution_columns.sql` | DB migration: `referral_code_used`, `referrer_email`, `referral_credit_issued_at` on `accounts` |

## Environment variables

| Variable | Where | Value |
| --- | --- | --- |
| `VITE_REFERRAL_ROCKET_CAMPAIGN_ID` | Vercel (webapp) | `ndjRTx0q` |
| `STRIPE_REFEREE_COUPON_ID` | Vercel / server env | ID of the $25-off Stripe coupon (create once in Stripe dashboard) |

## Stripe coupon setup (one-time, manual)

Create in Stripe Dashboard → Products → Coupons:
- **Amount off**: $25
- **Duration**: once (applies to first invoice only)
- **Redemption limits**: 1 per customer
- Copy the coupon ID and set it as `STRIPE_REFEREE_COUPON_ID` in the server environment (prod + test — create separate coupons for test mode).

## Access control

Only **individual users** and **team admins/superadmins** see the Referrals tab. Regular team members are blocked. See `useCanAccessReferrals.ts`.

## Attribution scope (v1)

Referral attribution is captured **at signup only**. Existing users who click a referral link after already having an account receive no attribution. This matches RR's own behavior (referrer binds once at first enrollment).

## How to test end-to-end

1. Run server against Stripe test mode.
2. Create test Stripe coupon ($25 off, once) in Stripe test dashboard. Set `STRIPE_REFEREE_COUPON_ID` to its ID.
3. Have Alice subscribe (Stripe test card 4242 4242 4242 4242).
4. From Alice's Settings → Referrals, copy her share link.
5. Open the link in a fresh browser (not incognito — third-party cookies may be blocked). Verify the login page shows signup form.
6. Sign up as Bob with a fresh email.
7. Verify in DB (`accounts` table): `referral_code_used` and `referrer_email` are set on Bob's row.
8. Bob goes to checkout. Verify in Stripe test dashboard: the Checkout Session shows the $25 coupon applied.
9. Bob pays. Verify webhook fires. Check DB: Bob's `referral_credit_issued_at` is set.
10. Check Stripe test dashboard → Alice's customer → Balance transactions: `-$25` entry with referral description.

## Gotchas

- **Do not click "Issue Reward" in RR dashboard** — credits are auto-applied by our backend. Double-clicking = double credit.
- **Campaign ID must match env var**: `VITE_REFERRAL_ROCKET_CAMPAIGN_ID=ndjRTx0q`. If the env var is wrong at build time, the script tag ships with the wrong campaign-id, RR enrolls users into a nonexistent campaign, and share links contain garbage codes.
- **Third-party cookies**: RR's cookie is set on `referralrocket.io`, third-party from `app.asksayso.com`. Safari and incognito aggressively block it. Test in regular Chrome.
- **`addParticipant` is idempotent**: safe to call on every login/signup.
- **`STRIPE_REFEREE_COUPON_ID` not set**: if this env var is missing, `applyRefereeCoupon` evaluates to false and checkout falls back to `allow_promotion_codes: true` (manual entry). No crash.
- **Referrer has no subscription**: if Alice hasn't paid yet, she has no `stripe_customer_id`. `maybeIssueReferralCredit` logs a warning and skips silently. The credit is lost (not deferred). For v1 this is acceptable — referrers are expected to be paying subscribers.
- **Trial plans**: referee coupon applies at checkout regardless of trial. The `-$25` balance transaction for the referrer only fires on the first non-zero invoice (`!isTrialInvoice`). For plans with a trial, Alice's credit fires at the end of Bob's trial period when his first real invoice pays.
