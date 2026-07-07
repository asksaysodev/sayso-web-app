import apiClient from "@/config/axios";

export interface PartnerPlanOption {
    id: string;
    plan_name: string;
    team_size: string;
    price_in_cents: number;
}

export default async function getPartnerPlanOptions(): Promise<PartnerPlanOption[]> {
    const response = await apiClient.get('/admin/partners/plans');
    if (!response?.data) throw new Error('Failed to fetch partner plan options');
    return response.data.data;
}
