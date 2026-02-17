import apiClient from "@/config/axios";
import type { GetAccountSubscriptionResponse } from "../types";

export default async function getActivePlan(): Promise<GetAccountSubscriptionResponse> {
    const response = await apiClient.get('/accounts/subscription');
    
    if (!response?.data) {
        throw new Error('Failed to fetch active plan');
    }

    return response?.data
}