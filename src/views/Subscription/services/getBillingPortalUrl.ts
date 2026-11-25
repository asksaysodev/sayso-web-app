import apiClient from "@/config/axios";
import type { GetBillingPortalUrlResponse } from "../types";

export default async function getBillingPortalUrl(): Promise<GetBillingPortalUrlResponse> {
    const response = await apiClient.post('/payment/stripe/customer-portal');
    if (!response?.data) {
        throw new Error('Failed to fetch billing portal url');
    }
    return response.data;
}
