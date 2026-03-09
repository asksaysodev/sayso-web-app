import apiClient from "@/config/axios";

interface AcceptInvitePayload {
    token: string;
    name: string;
    lastname: string;
}

export default async function acceptInvite(inviteId: string, payload: AcceptInvitePayload): Promise<unknown> {
    const response = await apiClient.post(`account/company/invite/${inviteId}/accept`, payload);

    if (!response?.data) {
        throw new Error("Failed to accept invite");
    }

    return response.data;
}
