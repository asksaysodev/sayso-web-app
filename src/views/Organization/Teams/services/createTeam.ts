import apiClient from "@/config/axios";
import type { CreateTeamInput, CreateTeamResponse } from "../types";
import hourCapPayload from "../utils/hourCapPayload";

export default async function createTeam({ name, hourCap, accountIds }: CreateTeamInput): Promise<CreateTeamResponse> {
    const response = await apiClient.post(`teams`, {
        name,
        ...hourCapPayload(hourCap),
        ...(accountIds.length > 0 && { accountIds }),
    });

    const data: CreateTeamResponse | undefined = response?.data;
    if (!data?.team) throw new Error('Failed to create team: unexpected response shape');

    return data;
}
