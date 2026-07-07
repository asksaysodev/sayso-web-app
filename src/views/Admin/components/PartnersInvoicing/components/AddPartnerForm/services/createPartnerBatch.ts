import apiClient from "@/config/axios";
import type { BatchTeam } from '../types';

export async function createPartnerBatch(partnerId: string, teams: BatchTeam[]): Promise<void> {
    await apiClient.post(`/admin/partners/${partnerId}/batch`, {
        teams: teams.map(team => ({
            email: team.email,
            plan_pricing_id: team.planOptionId,
        })),
    });
}
