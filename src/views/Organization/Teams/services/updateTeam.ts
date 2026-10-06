import apiClient from "@/config/axios";
import type { TeamRow, UpdateTeamInput } from "../types";

export default async function updateTeam({ teamId, name }: UpdateTeamInput): Promise<TeamRow> {
    const response = await apiClient.patch(`teams/${teamId}`, { name });

    const team: TeamRow | undefined = response?.data?.team;
    if (!team) throw new Error('Failed to update team: unexpected response shape');

    return team;
}
