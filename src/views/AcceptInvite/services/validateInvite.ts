import apiClient from "@/config/axios";

export interface ValidateInviteResponse {
    valid: true;
    email: string;
    companyName: string;
}

export default async function validateInvite(inviteId: string, token: string): Promise<ValidateInviteResponse> {
    const response = await apiClient.get(`account/company/invite/validate`, {
        params: { inviteId, token },
    });

    if (!response?.data) {
        throw new Error("Failed to validate invite");
    }

    return response.data;
}
