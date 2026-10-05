import apiClient from "@/config/axios";
import type { CreateTeamInput, CreateTeamResponse } from "../types";

// The Figma allocated-hours rule warns at 80%, so every cap is sent with that threshold.
const NOTIFY_AT_PERCENT = 80;

export default async function createTeam({ name, hourCap, accountIds }: CreateTeamInput): Promise<CreateTeamResponse> {
    const response = await apiClient.post(`teams`, {
        name,
        hour_cap: hourCap,
        notify_at_percent: hourCap === null ? null : NOTIFY_AT_PERCENT,
        ...(accountIds.length > 0 && { accountIds }),
    });

    const data: CreateTeamResponse | undefined = response?.data;
    if (!data?.team) throw new Error('Failed to create team: unexpected response shape');

    return data;
}
