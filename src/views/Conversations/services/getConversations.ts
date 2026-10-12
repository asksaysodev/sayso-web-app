import dayjs from "dayjs";
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

    const hasSummaryFilter = activeFilters.find(f => f.key === 'has_summary');
    params.set('has_summary', hasSummaryFilter ? 'true' : 'false');

    activeFilters.forEach((f) => {
        if (f.key === 'lead_type' && f.value !== 'all') params.set('lead_type', f.value);
        if (f.key === 'appointment_booked' && f.value === 'booked') params.set('appointment_booked', 'true');
        if (f.key === 'appointment_booked' && f.value === 'not booked') params.set('appointment_booked', 'false');
        if (f.key === 'lead_name' && f.value.trim()) params.set('lead_name', f.value.trim());
    });

    if (dateRange?.from) params.set('from', dayjs(dateRange.from).format('YYYY-MM-DD'));
    if (dateRange?.to) params.set('to', dayjs(dateRange.to).format('YYYY-MM-DD'));
    if (search) params.set('keyword', search);

    const response = await apiClient.get(`conversations?${params}`);

    if (!response?.data) {
        throw new Error('Failed to fetch conversations');
    }

    return response.data;
}
