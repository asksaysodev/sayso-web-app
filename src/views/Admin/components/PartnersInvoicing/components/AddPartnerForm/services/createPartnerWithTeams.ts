import apiClient from "@/config/axios";
import type { AddPartnerFormValues } from '../types';

export async function createPartnerWithTeams(values: AddPartnerFormValues): Promise<{ teamsInvited: number }> {
    const response = await apiClient.post('/admin/partners', {
        name: values.partnerName,
        billing_email: values.billingEmail,
        net_terms: Number(values.netTerms),
        teams: values.teams.map(team => ({
            email: team.email,
            plan_pricing_id: team.planOptionId,
        })),
    });
    if (!response?.data?.data) throw new Error('Failed to create partner');
    return { teamsInvited: response.data.data.teams_invited };
}
