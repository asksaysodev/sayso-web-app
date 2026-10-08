import apiClient from "@/config/axios";

export default async function resendInvite(inviteId: string): Promise<void> {
    await apiClient.post(`company/invite/resend`, null, {
        params: { inviteId },
    });
}
