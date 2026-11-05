import apiClient from "@/config/axios";
import type { CheckoutFlow, GetStripeCheckoutPageUrlResponse } from "../types";

export default async function getStripeCheckoutPageUrl(
    stripePriceId: string,
    flow?: CheckoutFlow,
): Promise<GetStripeCheckoutPageUrlResponse> {
    const response = await apiClient.post(`/payment/checkout/stripe`, { stripePriceId, ...(flow ? { flow } : {}) });
    if (!response?.data) {
        throw new Error('Failed to fetch stripe checkout page url');
    }
    return response.data;
}
