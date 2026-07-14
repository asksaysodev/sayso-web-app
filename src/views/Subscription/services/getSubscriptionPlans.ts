import apiClient from "@/config/axios";
import { getOfferToken } from "@/utils/offerToken";
import type { GetPricingPlansResponse } from "../types";

export default async function getSubscriptionPlans(): Promise<GetPricingPlansResponse> {
    const offer = getOfferToken();
    const response = await apiClient.get('/pricing/plans', offer ? { params: { offer } } : undefined);

    if (!response?.data) {
        throw new Error('Failed to fetch subscription plans');
    }

    return response?.data
}