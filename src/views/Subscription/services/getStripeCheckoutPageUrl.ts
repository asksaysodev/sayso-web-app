import apiClient from "@/config/axios";
import type { GetStripeCheckoutPageUrlResponse } from "../types";

export default async function getStripeCheckoutPageUrl(stripePriceId: string): Promise<GetStripeCheckoutPageUrlResponse> {
    const response = await apiClient.post(`/payment/checkout/stripe`, { stripePriceId });
    if (!response?.data) {
        throw new Error('Failed to fetch stripe checkout page url');
    }
    return response.data;
}