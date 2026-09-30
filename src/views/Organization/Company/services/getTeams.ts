import apiClient from "@/config/axios";
import type { Team } from "../types";

export default async function getTeams(): Promise<Team[]> {
    const response = await apiClient.get(`teams`);

    const teams: Team[] | undefined = response?.data?.teams;
    if (!Array.isArray(teams)) throw new Error('Failed to fetch teams: unexpected response shape');

    return teams.map(({ id, name }) => ({ id, name }));
}
