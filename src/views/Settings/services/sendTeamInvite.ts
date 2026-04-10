import apiClient from "@/config/axios";

export interface SkippedInvite {
    email: string;
    reason: string;
}

interface SentInvite {
    id: string;
    email: string;
    status: string;
    expires_at: string;
}

export interface SendTeamInviteResponse {
    message: string;
    invites: SentInvite[];
    skipped: SkippedInvite[];
}

export default async function sendTeamInvite(emails: string[]): Promise<SendTeamInviteResponse> {
    const response = await apiClient.post(`accounts/company/invite`, { emails });

    if (!response?.data) {
        throw new Error('Failed to send team invite');
    }

    return response.data;
}
