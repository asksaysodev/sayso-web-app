import apiClient from "@/config/axios";
import type { RemoveTeamMemberInput } from "../types";

export default async function removeTeamMember({ teamId, accountId }: RemoveTeamMemberInput): Promise<void> {
    await apiClient.delete(`teams/${teamId}/members/${accountId}`);
}
