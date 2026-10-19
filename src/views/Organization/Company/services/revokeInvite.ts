import apiClient from "@/config/axios";

export default async function revokeInvite(inviteId: string): Promise<void> {
    await apiClient.post(`company/invite/revoke`, null, {
        params: { inviteId },
    });
}
