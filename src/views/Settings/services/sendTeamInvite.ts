import apiClient from "@/config/axios";

export default async function sendTeamInvite(emails: string[]): Promise<unknown> {
    const response = await apiClient.post(`accounts/company/invite`, { emails });

    if (!response?.data) {
        throw new Error('Failed to send team invite');
    }

    return response.data;
}
