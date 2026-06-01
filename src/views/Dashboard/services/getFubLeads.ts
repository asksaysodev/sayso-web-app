import apiClient from "@/config/axios";
import type { FubLeadsResponse } from "@/types/fub";

export default async function getFubLeads(): Promise<FubLeadsResponse> {
    const response = await apiClient.get<FubLeadsResponse>('/fub/leads');
    if (!response?.data) throw new Error('Failed to fetch FUB leads');
    return response.data;
}
