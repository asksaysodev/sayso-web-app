import apiClient from "@/config/axios";
import type { TransferTeamMemberInput } from "../types";

export default async function transferTeamMember({ teamId, accountId, toTeamId }: TransferTeamMemberInput): Promise<void> {
    await apiClient.patch(`teams/${teamId}/members/${accountId}`, { team_id: toTeamId });
}
