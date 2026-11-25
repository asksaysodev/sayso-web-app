export interface GetAccountSubscriptionResponse {
    subscription: {
      plan: string;
      name: string;
      description: string;
      // Pricing is resolved from the company's stripe_price_id, which the cancellation
      // webhook clears while the plan itself survives to the end of the paid period. The
      // server recovers the pricing row from the plan where it can, but a plan with more
      // than one price and no billing period to disambiguate it stays unresolved — these
      // are null in that case rather than the request failing (SAYSO-407).
      interval: string | null;
      price: {
        priceInCents: number | null;
        currency: string | null;
      };
      includedMinutes: {
        plan: number | null;
        trial: number | null;
      };
      status: string;
      billing: {
        cycle: string | null;
        period: {
          start: string | null;
          end: string | null;
        };
        lastInvoicePaidAt: string | null;
      };
      cancelledAt: string | null;
      cancellation: { pending: boolean; accessEndsAt: string | null };
      pause: {
        state: 'none' | 'scheduled' | 'paused';
        startsAt: string | null;
        resumesAt: string | null;
        priceOnReturn: number | null;
      };
      discount: {
        active: boolean;
        percentOff: number | null;
        discountedPrice: number | null;
        standardPrice: number | null;
        endsAt: string | null;
        fullPriceFrom: string | null;
      };
      isPartnerFunded: boolean;
      partnerName: string | null;
    };
    invoices: Array<{
      account_id: string;
      id: string | null;
      description: string | null;
      created_at: string | null;
      period_start: string | null;
      period_end: string | null;
      currency: string;
      amount_due_in_cents: number | null;
      amount_paid_in_cents: number | null;
      status: string | null;
      url: string | null;
      pdf_url: string | null;
    }>;
}

export interface GetBillingPortalUrlResponse {
    url: string;
}

export interface PauseOption {
    months: number;
    startsAt: string;
    resumesAt: string;
    priceOnReturn: number;
}

export interface RetentionDiscount {
    offerKey: string;
    percentOff: number;
    durationMonths: number;
    standardPrice: number;
    discountedPrice: number;
    discountedBillDates: string[];
    fullPriceFrom: string;
}

export interface CancellationReason {
    key: string;
    label: string;
}

/** What the company can be offered right now; `null` offers are not available to it. */
export interface RetentionOptions {
    canCancel: boolean;
    accessEndsAt: string | null;
    pause: { options: PauseOption[] } | null;
    discount: RetentionDiscount | null;
    reasons: CancellationReason[];
}

/** Both empty when the user skipped the reason step. The server refuses details without a key. */
export interface CancellationFeedback {
    reasonKey?: string;
    reasonDetails?: string;
}

export interface PauseSubscriptionResponse {
    pauseStartsAt: string;
    resumesAt: string;
    priceOnReturn: number;
}

export interface ApplyRetentionDiscountRequest extends CancellationFeedback {
    offerKey: string;
}

export interface CancelSubscriptionResponse {
    accessEndsAt: string;
}

export interface ReactivateSubscriptionResponse {
    reactivated: boolean;
}

/** Whether the user was told resuming charges today; the server refuses (`resume_changed`) on a mismatch. */
export interface ResumeSubscriptionRequest {
    expectNewCycle: boolean;
}

export interface ResumeSubscriptionResponse {
    resumed: boolean;
    newCycle: boolean;
    renewsAt: string | null;
}

/** Allowlisted checkout origins the server understands; picks the Stripe return URLs. */
export type CheckoutFlow = 'signup';

export interface GetStripeCheckoutPageUrlResponse {
    url: string;
}

export type GetPricingPlansResponse = PricingPlan[];

export interface PlanFeature {
  id: string;
  name: string;
  included: boolean;
  type?: 'feature' | 'benefit';
  detail?: string 
}

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  features: { features: PlanFeature[] };
  includedMinutes: number;
  type: string;
  purchasable: boolean;
  contactLink: string | null;
  pricingOptions: PricingOption[];
  popular: boolean;
  hasTrial: boolean;
  trialDays: number | null;
  trialIncludedMinutes: number | null;
  hasPackages: boolean;
  generation: 'legacy' | 'new' | null;
  accountType: 'individual' | 'team' | null;
}

export interface PricingOption {
  stripePriceId: string;
  priceInCents: number;
  discountInCents: number;
  currency: string;
  interval: string;
  includedMinutesPerMonth: number;
  teamSize: string;
  planName: string;
  sortOrder: number;
}

export type BillingInterval = 'month' | 'year';
export enum BillingIntervalEnum {
    MONTH = 'month',
    YEAR = 'year',
}

export interface UpgradeTrialSuccessResponse {
  message: string;
  status: string;
}

