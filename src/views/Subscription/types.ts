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

export interface GetStripeCancellationPageUrlResponse {
    url: string;
}

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

