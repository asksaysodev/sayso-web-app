import apiClient from "@/config/axios";
import { ResetAccountSubscriptionResponse } from "../types";

export default async function resetAccountSubscription(): Promise<ResetAccountSubscriptionResponse> {
    const response = await apiClient.post(`admin/subscription/reset`);

    if (!response?.data) {
        throw new Error('Failed to reset account subscription');
    }

    return response.data;
}
