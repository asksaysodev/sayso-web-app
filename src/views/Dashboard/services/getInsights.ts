import apiClient from "@/config/axios";
import type { GetInsightsResponse } from "@/types/coach";

export default async function getInsights(page = 0): Promise<GetInsightsResponse> {
    const response = await apiClient.get(`sales-coach/insights/history?page=${page}`);

    if (!response?.data) {
        throw new Error('Failed to fetch insights');
    }

    return response.data;
}