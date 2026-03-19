import apiClient from "@/config/axios";

export default async function sendPasswordRecoveryEmail(
    email: string
): Promise<void> {
    const response = await apiClient.post(`auth/password-reset`, { email });
    if (!response?.data) {
        throw new Error('Failed to send password recovery email');
    }
    return response.data;
}