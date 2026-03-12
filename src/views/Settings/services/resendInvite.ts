import apiClient from "@/config/axios";

export default async function resendInvite(inviteId: string): Promise<void> {
    await apiClient.post(`accounts/company/invite/resend`, null, {
        params: { inviteId },
    });
}
