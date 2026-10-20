import apiClient from "@/config/axios";
import type { AssignableRole } from "@/views/Organization/shared/types";
import type { SendTeamInviteResponse } from "../types";

/** No `teamId` = no team, no `role` = user. */
export default async function sendTeamInvite(emails: string[], teamId?: string | null, role?: AssignableRole): Promise<SendTeamInviteResponse> {
    const response = await apiClient.post(`company/invite`, {
        emails,
        ...(teamId ? { teamId } : {}),
        ...(role ? { role } : {}),
    });

    if (!response?.data) {
        throw new Error('Failed to send team invite');
    }

    return response.data;
}
