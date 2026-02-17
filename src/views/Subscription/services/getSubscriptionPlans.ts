import apiClient from "@/config/axios";
import type { GetPricingPlansResponse } from "../types";

export default async function getSubscriptionPlans(): Promise<GetPricingPlansResponse> {
    const response = await apiClient.get('/pricing/plans');
    
    if (!response?.data) {
        throw new Error('Failed to fetch subscription plans');
    }

    return response?.data
}