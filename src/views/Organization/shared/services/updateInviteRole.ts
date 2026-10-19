import apiClient from "@/config/axios";
import type { AssignableRole } from "../types";

export interface UpdateInviteRoleInput {
    inviteId: string;
    role: AssignableRole;
}

export default async function updateInviteRole({ inviteId, role }: UpdateInviteRoleInput): Promise<void> {
    await apiClient.patch(`company/invite/role`, { inviteId, role });
}
