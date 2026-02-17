import apiClient from "@/config/axios";
import type { UpgradeTrialSuccessResponse } from "../types";

export default async function upgradeTrialSubscription(): Promise<UpgradeTrialSuccessResponse> {
    const response = await apiClient.post(`/payment/stripe/upgrade-subscription`);
    if (!response?.data) {
        throw new Error('Failed to upgrade trial subscription');
    }
    return response.data;
}
