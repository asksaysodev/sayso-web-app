import apiClient from "@/config/axios";

export default async function sendTeamInvite(email: string): Promise<unknown> {
    const response = await apiClient.post(`accounts/company/invite`, {
        email
    });
    
    if (!response?.data) {
        throw new Error('Failed to send team invite');
    }

    return response.data;
}