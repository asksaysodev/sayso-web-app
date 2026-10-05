import apiClient from "@/config/axios";
import type { TeamSummary } from "../types";

export default async function getTeams(): Promise<TeamSummary[]> {
    const response = await apiClient.get(`teams`);

    const teams: TeamSummary[] | undefined = response?.data?.teams;
    if (!Array.isArray(teams)) throw new Error('Failed to fetch teams: unexpected response shape');

    return teams;
}
