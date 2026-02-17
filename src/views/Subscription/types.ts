export interface GetAccountSubscriptionResponse {
    subscription: {
      plan: string;
      name: string;
      description: string;
      interval: string;
      price: {
        priceInCents: number;
        currency: string;
      };
      includedMinutes: {
        plan: number;
        trial: number;
      };
      status: string;
      billing: {
        cycle: string;
        period: {
          start: string | null;
          end: string | null;
        };
        lastInvoicePaidAt: string | null;
      };
      cancelledAt: string | null;
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

export interface GetPricingPlansResponse extends Array<PricingPlan> {}

export interface PlanFeature {
  id: string;
  name: string;
  included: boolean;
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
}

export interface PricingOption {
  stripePriceId: string;
  priceInCents: number;
  currency: string;
  interval: string;
  includedMinutesPerMonth: number;
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

export interface UpgradeTrialErrorResponse {
  error: string;
}
