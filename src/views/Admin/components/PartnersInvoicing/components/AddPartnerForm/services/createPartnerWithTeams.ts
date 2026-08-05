import apiClient from "@/config/axios";
import type { AddPartnerFormValues } from '../types';

export async function createPartnerWithTeams(values: AddPartnerFormValues): Promise<{ teamsInvited: number }> {
    const discountPercent = Number(values.discountPercent?.trim() || 0);

    const response = await apiClient.post('/admin/partners', {
        name: values.partnerName,
        billing_email: values.billingEmail,
        net_terms: Number(values.netTerms),
        // Gate on the number, not on the string being non-empty: "0" is a truthy
        // string but means "no discount", so a string check would send
        // discount_percent: 0. Anything non-zero is sent as typed — including
        // out-of-range values — so the server rejects it loudly rather than us
        // silently dropping it and creating the partner at list price.
        ...(discountPercent ? { discount_percent: discountPercent } : {}),
        teams: values.teams.map(team => ({
            email: team.email,
            plan_pricing_id: team.planOptionId,
        })),
    });
    if (!response?.data?.data) throw new Error('Failed to create partner');
    return { teamsInvited: response.data.data.teams_invited };
}
