import apiClient from "@/config/axios";
import type { AssignableRole } from "../types";

export interface UpdateMemberRoleInput {
    memberId: string;
    role: AssignableRole;
}

export default async function updateMemberRole({ memberId, role }: UpdateMemberRoleInput): Promise<void> {
    await apiClient.patch(`company/members/role`, { memberId, role });
}
