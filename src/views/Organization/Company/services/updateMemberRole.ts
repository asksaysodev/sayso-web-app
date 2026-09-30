import apiClient from "@/config/axios";
import type { AssignableRole, CompanyMemberRow } from "../types";

export interface UpdateMemberRoleInput {
    memberId: string;
    role: AssignableRole;
}

export default async function updateMemberRole({ memberId, role }: UpdateMemberRoleInput): Promise<CompanyMemberRow> {
    const response = await apiClient.patch(`company/members/role`, { memberId, role });

    const member: CompanyMemberRow | undefined = response?.data?.member;
    if (!member) throw new Error('Failed to update member role: unexpected response shape');

    return member;
}
