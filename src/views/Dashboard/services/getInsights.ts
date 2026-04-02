import apiClient from "@/config/axios";
import type { GetInsightsResponse } from "@/types/coach";
import type { DateRange } from "react-day-picker";

export default async function getInsights(
    page = 0,
    activeFilters: Array<{ key: string; value: string }> = [],
    dateRange?: DateRange,
    search = ""
): Promise<GetInsightsResponse> {
    const params = new URLSearchParams({ page: String(page) });

    activeFilters.forEach((f) => {
        if (f.key === 'lead_type' && f.value !== 'all') params.set('lead_type', f.value);
    });

    if (dateRange?.from) params.set('from', dateRange.from.toISOString().split('T')[0]);
    if (dateRange?.to) params.set('to', dateRange.to.toISOString().split('T')[0]);
    if (search) params.set('search', search)
    
    const response = await apiClient.get(`sales-coach/insights/history?${params}`);

    if (!response?.data) {
        throw new Error('Failed to fetch insights');
    }

    return response.data;
}