import apiClient from "@/config/axios";
import { getOfferToken } from "@/utils/offerToken";
import type { GetPricingPlansResponse } from "../types";

export default async function getSubscriptionPlans(offer?: string | null): Promise<GetPricingPlansResponse> {
    const token = offer ?? getOfferToken();
    const response = await apiClient.get('/pricing/plans', token ? { params: { offer: token } } : undefined);

    if (!response?.data) {
        throw new Error('Failed to fetch subscription plans');
    }

    return response?.data
}

/**
 * One definition of the plans query, so the sign-up prefetch (/signup, before the account
 * exists — the endpoint is public) and the plan step (/signup/plan) share a cache entry.
 */
export const subscriptionPlansQuery = (offer: string | null) => ({
    queryKey: ['subscription-plans', offer] as const,
    queryFn: () => getSubscriptionPlans(offer),
});