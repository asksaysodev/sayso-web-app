import apiClient from "@/config/axios";
import type { FubLeadsResponse } from "@/types/fub";

export interface GetFubLeadsParams {
    query?: string;     // generic name search → server passes as `name` to FUB
    email?: string;
    firstName?: string;
    lastName?: string;
    limit?: number;
    offset?: number;
    sort?: string;
    next?: string;
}

export default async function getFubLeads(params?: GetFubLeadsParams): Promise<FubLeadsResponse> {
    const response = await apiClient.get<FubLeadsResponse>('/fub/leads', { params });
    if (!response?.data) throw new Error('Failed to fetch FUB leads');
    return response.data;
}
