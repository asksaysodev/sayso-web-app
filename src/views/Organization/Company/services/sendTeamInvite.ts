import apiClient from "@/config/axios";
import type { SendTeamInviteResponse } from "../types";

export default async function sendTeamInvite(emails: string[], teamId?: string | null): Promise<SendTeamInviteResponse> {
    const response = await apiClient.post(`company/invite`, teamId ? { emails, teamId } : { emails });

    if (!response?.data) {
        throw new Error('Failed to send team invite');
    }

    return response.data;
}
