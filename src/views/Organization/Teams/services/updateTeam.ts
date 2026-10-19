import apiClient from "@/config/axios";
import type { TeamRow, UpdateTeamInput } from "../types";
import hourCapPayload from "../utils/hourCapPayload";

export default async function updateTeam(input: UpdateTeamInput): Promise<TeamRow> {
    const body = 'name' in input ? { name: input.name } : hourCapPayload(input.hourCap);
    const response = await apiClient.patch(`teams/${input.teamId}`, body);

    const team: TeamRow | undefined = response?.data?.team;
    if (!team) throw new Error('Failed to update team: unexpected response shape');

    return team;
}
