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