import apiClient from "@/config/axios";

export interface ValidateInviteResponse {
    inviteId: string;
    companyId: string;
    email: string;
    companyName: string;
    expiresAt: string;
}

export default async function validateInvite(token: string): Promise<ValidateInviteResponse> {
    const response = await apiClient.get(`accounts/company/invite/validate`, {
        params: { token },
    });

    if (!response?.data) {
        throw new Error("Failed to validate invite");
    }

    return response.data;
}
