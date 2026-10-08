import apiClient from "@/config/axios";
import type { AddTeamMembersInput } from "../types";

export default async function addTeamMembers({ teamId, accountIds }: AddTeamMembersInput): Promise<void> {
    await apiClient.post(`teams/${teamId}/members`, { accountIds });
}
