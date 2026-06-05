import apiClient from "@/config/axios";
import type { GetConversationsResponse } from "@/types/coach";
import type { DateRange } from "react-day-picker";

export default async function getConversations(
    page = 0,
    activeFilters: Array<{ key: string; value: string }> = [],
    dateRange?: DateRange,
    search = ""
): Promise<GetConversationsResponse> {
    const params = new URLSearchParams({ page: String(page) });

    activeFilters.forEach((f) => {
        if (f.key === 'lead_type' && f.value !== 'all') params.set('lead_type', f.value);
        if (f.key === 'appointment_booked' && f.value !== 'all') params.set('appointment_booked', f.value);
        if (f.key === 'has_summary') params.set('has_summary', f.value);
    });

    if (dateRange?.from) params.set('from', dateRange.from.toISOString().split('T')[0]);
    if (dateRange?.to) params.set('to', dateRange.to.toISOString().split('T')[0]);
    if (search) params.set('keyword', search);

    const response = await apiClient.get(`conversations?${params}`);

    if (!response?.data) {
        throw new Error('Failed to fetch conversations');
    }

    return response.data;
}
