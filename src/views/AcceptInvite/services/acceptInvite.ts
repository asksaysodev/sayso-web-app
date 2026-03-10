import apiClient from "@/config/axios";

interface AcceptInvitePayload {
    // token: string;
    email: string;
    name?: string;
    lastname?: string;
    company?: string;
}

export default async function acceptInvite(payload: AcceptInvitePayload): Promise<unknown> {
    const response = await apiClient.post(`accounts/company/invite/accept`, payload);

    if (!response?.data) {
        throw new Error("Failed to accept invite");
    }

    return response.data;
}
