import apiClient from "@/config/axios";
import type { GetStripeCancellationPageUrlResponse } from "../types";

export default async function getStripeCancellationPageUrl(stripePriceId: string): Promise<GetStripeCancellationPageUrlResponse> {
    const response = await apiClient.post(`/payment/stripe/customer-portal`, { stripePriceId });
    if (!response?.data) {
        throw new Error('Failed to fetch stripe cancellation page url');
    }
    return response.data;
}