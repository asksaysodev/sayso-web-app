import apiClient from "@/config/axios";

interface AcceptInvitePayload {
    // token: string;
    email: string;
    name?: string;
    lastname?: string;
    company?: string;
}

export default async function acceptInvite(payload: AcceptInvitePayload, token: string): Promise<unknown> {
    const response = await apiClient.post(`accounts/company/invite/accept?token=${token}`, payload);

    if (!response?.data) {
        throw new Error("Failed to accept invite");
    }

    return response.data;
}
