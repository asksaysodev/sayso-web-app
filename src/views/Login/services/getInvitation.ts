import apiClient from "@/config/axios";

export interface InvitationInfo {
    email: string;
    plan_name: string;
    team_size: number;
    partner_name: string;
}

export default async function getInvitation(token: string): Promise<InvitationInfo> {
    const response = await apiClient.get(`/invitations/${token}`);
    if (!response?.data) throw new Error("Failed to fetch invitation");
    return response.data;
}
