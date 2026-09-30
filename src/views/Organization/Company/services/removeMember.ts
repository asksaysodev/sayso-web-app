import apiClient from "@/config/axios";

export default async function removeMember(memberId: string): Promise<void> {
    await apiClient.delete(`company/members/remove?memberId=${memberId}`);
}
