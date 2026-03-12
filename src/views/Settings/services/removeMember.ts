import apiClient from "@/config/axios";

export default async function removeMember(memberId: string): Promise<void> {
    await apiClient.delete(`accounts/company/members/remove?memberId=${memberId}`);
}
