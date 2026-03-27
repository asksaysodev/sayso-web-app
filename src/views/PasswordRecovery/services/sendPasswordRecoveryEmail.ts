import apiClient from "@/config/axios";

interface RecoveryEmailResponse {
    message: string;
}

export default async function sendPasswordRecoveryEmail(email: string): Promise<RecoveryEmailResponse> {
    const response = await apiClient.post(`auth/password-reset`, { email });
    if (!response?.data) {
        throw new Error('Failed to send password recovery email');
    }
    return response.data;
}