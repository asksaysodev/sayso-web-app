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

---

## User journey (plain English)

**Alice** has been using Sayso for a few months. She opens Settings → Referrals and sees her unique share link. She sends it to Bob.

**Bob** clicks the link. The Referral Rocket widget (a small JS script loaded in `index.html`) reads the `?referralCode=XXXX` from the URL and silently stores it in a 60-day cookie on Bob's browser. The login page auto-switches to the signup form so Bob doesn't have to hunt for the right tab.

**Bob signs up.** The moment he creates his account, Sayso fires a chain of calls in the background (fire-and-forget, never blocks signup):
1. Enrolls Bob in RR — RR reads the cookie and links Bob to Alice's referral code.
2. Asks RR "who referred Bob?" — gets back Alice's email and her referral code.
3. Saves that info (`referral_code_used`, `referrer_email`) on Bob's account row in the database. This is the attribution record that drives everything downstream.

**Bob goes to choose a plan.** The subscription page calls our `/pricing/plans` endpoint. The server sees Bob has `referral_code_used` set, fetches the actual discount amount from the Stripe coupon, and returns it embedded in each pricing option (`discountInCents: 2500`). The UI shows the discounted price with the original struck through, and a green "Referral credit active · $25 off applied at checkout" strip on each plan card. For the Team plan's package picker, the same strip appears at the top of the overlay and each package row shows the discounted price.

**Bob clicks Get started.** Our server creates a Stripe Checkout Session with `discounts: [{ coupon: STRIPE_REFEREE_COUPON_ID }]`. Stripe automatically applies $25 off — Bob sees "Coupon: −$25.00" on the Stripe-hosted checkout page. No manual coupon entry, no promo code, nothing to remember.

**Bob pays.** Stripe fires an `invoice.paid` webhook to our server. The server:
1. Checks whether this is a real payment or a free trial start (trial invoices have `amount_paid === 0`).
2. If it's a real payment, runs `maybeIssueReferralCredit`: finds Alice's account via `referrer_email`, looks up her `stripe_customer_id`, and creates a `-$25` customer balance transaction on Alice's Stripe account. An idempotency key (`referral-credit-{bob_account_id}`) prevents double-crediting if the webhook fires twice.
3. Marks Bob's account with `referral_credit_issued_at` so Alice can never be credited for Bob twice.

**Alice's next invoice.** Stripe automatically deducts the $25 credit from Alice's next bill. She doesn't need to do anything — it appears as "Customer balance applied" on her invoice.

---

## Two-way attribution explained

The feature is called "double-sided" because both parties benefit:

| Who | What they get | When they get it |
| --- | --- | --- |
| **Referrer (Alice)** | $25 Stripe customer balance credit | When the referee makes their first real payment |
| **Referee (Bob)** | $25 off their first payment via Stripe coupon | At Stripe Checkout, automatically applied |

The attribution chain is:
1. **RR tracks the referral** — who gave the link, who clicked it, cookie ties them together.
2. **We persist the attribution** — `referral_code_used` + `referrer_email` on Bob's `accounts` row. This is our source of truth, independent of RR.
3. **Stripe delivers the rewards** — coupon at checkout for Bob, customer balance for Alice. RR's role is attribution ledger only; we bypass RR's "Issue Reward" button entirely.

---

## End-to-end technical flow

1. **Alice** opens `/settings` → Referrals tab → sees her share link: `https://app.asksayso.com/login?referralCode=XXXX`.
2. **Bob** clicks the link. RR widget reads `?referralCode=XXXX` and stores it in a cookie (60-day retention). Login page auto-switches to signup form.
3. Bob signs up. `AuthContext.signUp` fires the referral attribution chain (fire-and-forget IIFE):
   - `enrollReferralParticipant` — RR binds Bob's email to Alice via the cookie.
   - `getParticipantReferrer({ email: bob })` — reads Bob's `referredByCode` and `referrerEmail` from RR SDK.
   - `setReferralAttribution` — POST to `/accounts/referral-attribution`; server persists `referral_code_used` and `referrer_email` on Bob's `accounts` row.
4. Bob visits `/subscription`. Frontend calls `GET /pricing/plans`. Server:
   - Checks `account.referral_code_used` for the requesting user.
   - If set and `STRIPE_REFEREE_COUPON_ID` is configured, calls `stripe.coupons.retrieve(couponId)` once (result cached in-memory per `test`/`prod` key for the server process lifetime).
   - Returns `discountInCents: <amount_off from Stripe>` on every pricing option. Non-eligible users get `discountInCents: 0`.
5. Frontend receives plans with `discountInCents`. `PricingComponent` displays:
   - Discounted price (original − discount) as the hero price, original struck through.
   - Green "Referral credit active" savings strip between the price block and CTA.
   - Inside the Team package picker overlay: compact credit bar + discounted price per row.
   - No amount is hardcoded — everything is driven by `discountInCents` from the API.
6. Bob clicks "Get started". `createCheckoutSession` reads `account.referral_code_used`; because it's set, creates the Stripe Checkout Session with `discounts: [{ coupon: STRIPE_REFEREE_COUPON_ID }]`. Bob sees −$25 on the Stripe checkout page. No manual coupon entry.
7. Bob pays. Stripe fires `invoice.paid`. `maybeIssueReferralCredit` runs:
   - Finds Bob's account via `referral_code_used` + `referrer_email`.
   - Looks up Alice's `stripe_customer_id`.
   - Creates a `−$25` customer balance transaction on Alice's Stripe account (idempotency key: `referral-credit-{bob_account_id}`).
   - Sets `referral_credit_issued_at` on Bob's account (prevents double-crediting).
8. Stripe auto-applies Alice's $25 credit to her next invoice.

---

## Why we don't use RR's "Issue Reward" feature

RR's dashboard has a manual "Issue Reward → Send Rewards with Stripe" button. We do NOT use it — our code handles credits automatically via Stripe's customer balance API. **Do not click "Issue Reward" in the RR dashboard** for any user, or they will receive a double credit ($50 instead of $25).

RR's role in our stack is attribution ledger only (tracking who referred whom). The actual money flow goes through our backend + Stripe.

---

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
| `src/views/Subscription/types.ts` | `PricingOption` type includes `discountInCents` field |
| `src/views/Subscription/components/PricingComponent.tsx` | Plan card UI — shows savings strip, struck-through price, overlay credit bar |
| `src/views/Subscription/styles/PricingComponent.css` | Styles for savings strip, price strike, overlay credit bar, tier price column |
| `server/controllers/account.controller.js` | `setReferralAttribution` endpoint; `getAccountByEmail` returns `has_referral_discount` |
| `server/controllers/pricing.controller.js` | `getPricingPlans` — fetches Stripe coupon amount, caches it, embeds `discountInCents` per option |
| `server/controllers/payment.controller.js` | `createCheckoutSession` (applies coupon), `maybeIssueReferralCredit` (credits referrer) |
| `server/routes/account.routes.js` | `POST /accounts/referral-attribution` route |
| `server/db/migrations/007_referral_attribution_columns.sql` | DB migration: `referral_code_used`, `referrer_email`, `referral_credit_issued_at` on `accounts` |

---

## Environment variables

| Variable | Where | Value |
| --- | --- | --- |
| `VITE_REFERRAL_ROCKET_CAMPAIGN_ID` | Vercel (webapp) | `ndjRTx0q` |
| `STRIPE_REFEREE_COUPON_ID` | Heroku (server) | ID of the $25-off Stripe coupon — `Referral_Rocket_928_1776231381212` |

> **Note:** `STRIPE_REFEREE_COUPON_ID` goes on **Heroku** (where the server runs), NOT on Vercel (which hosts the webapp). The webapp never reads this variable — it receives `discountInCents` from the server at runtime.

---

## Stripe coupon setup (one-time, manual)

Create in Stripe Dashboard → Products → Coupons:
- **Amount off**: $25
- **Duration**: once (applies to first invoice only)
- **Redemption limits**: 1 per customer
- Copy the coupon ID and set it as `STRIPE_REFEREE_COUPON_ID` in the Heroku server environment (prod + test — create separate coupons for test mode).

The coupon amount is fetched live from Stripe by the server and cached in memory. If you ever change the coupon amount, restart the server to clear the cache.

---

## Supabase migration (must run before deploying)

```sql
-- server/db/migrations/007_referral_attribution_columns.sql
ALTER TABLE accounts
    ADD COLUMN IF NOT EXISTS referral_code_used TEXT NULL,
    ADD COLUMN IF NOT EXISTS referrer_email TEXT NULL,
    ADD COLUMN IF NOT EXISTS referral_credit_issued_at TIMESTAMPTZ NULL;
```

Run this in the Supabase SQL editor before deploying the server changes.

---

## Access control

Only **individual users** and **team admins/superadmins** see the Referrals tab. Regular team members are blocked. See `useCanAccessReferrals.ts`.

---

## Attribution scope (v1)

Referral attribution is captured **at signup only**. Existing users who click a referral link after already having an account receive no attribution. This matches RR's own behavior (referrer binds once at first enrollment).

---

## How to test end-to-end

1. Run server against Stripe test mode.
2. Create test Stripe coupon ($25 off, once) in Stripe test dashboard. Set `STRIPE_REFEREE_COUPON_ID` to its ID in the server `.env`.
3. Have Alice subscribe (Stripe test card 4242 4242 4242 4242).
4. From Alice's Settings → Referrals, copy her share link.
5. Open the link in a fresh browser (not incognito — third-party cookies may be blocked). Verify the login page shows the signup form.
6. Sign up as Bob with a fresh email.
7. Verify in DB (`accounts` table): `referral_code_used` and `referrer_email` are set on Bob's row.
8. Bob visits `/subscription`. Verify the plan cards show a discounted price (struck-through original) and the green savings strip. The discount amount should match the Stripe coupon — not a hardcoded value.
9. Bob clicks Get started. Verify in Stripe test dashboard: the Checkout Session shows the $25 coupon applied.
10. Bob pays. Verify webhook fires. Check DB: Bob's `referral_credit_issued_at` is set.
11. Check Stripe test dashboard → Alice's customer → Balance transactions: `−$25` entry with referral description.

---

## Gotchas

- **Do not click "Issue Reward" in RR dashboard** — credits are auto-applied by our backend. Clicking it = double credit ($50 instead of $25).
- **Campaign ID must match env var**: `VITE_REFERRAL_ROCKET_CAMPAIGN_ID=ndjRTx0q`. If wrong at build time, RR enrolls users into a nonexistent campaign and share links contain garbage codes. This happened once in prod — the env var was set to `"development"`.
- **`STRIPE_REFEREE_COUPON_ID` goes on Heroku, not Vercel.** The webapp never needs this variable. Only the server does.
- **Coupon amount is cached** — if you change the Stripe coupon's `amount_off`, restart the server to clear the in-memory cache. The discount UI will then reflect the new amount automatically.
- **Third-party cookies**: RR's cookie is set on `referralrocket.io`, third-party from `app.asksayso.com`. Safari and incognito aggressively block it. Test in regular Chrome.
- **`addParticipant` is idempotent**: safe to call on every login/signup.
- **`STRIPE_REFEREE_COUPON_ID` not set**: if this env var is missing, `discountInCents` returns `0` from the plans endpoint, the discount UI is hidden entirely, and checkout falls back to `allow_promotion_codes: true`. No crash.
- **Referrer has no subscription**: if Alice hasn't paid yet, she has no `stripe_customer_id`. `maybeIssueReferralCredit` logs a warning and skips silently. The credit is lost (not deferred). For v1 this is acceptable — referrers are expected to be paying subscribers.
- **Trial plans**: referee coupon applies at checkout regardless of trial. The `−$25` balance transaction for the referrer only fires on the first non-zero invoice (`!isTrialInvoice`). For plans with a trial, Alice's credit fires at the end of Bob's trial period when his first real invoice pays.
- **Self-referral guard**: the server checks `referrerEmail !== req.user.email` and rejects self-referrals silently.
