import apiClient from "@/config/axios";
import type { TeamDetail } from "../types";

export default async function getTeam(teamId: string): Promise<TeamDetail> {
    const response = await apiClient.get(`teams/${teamId}`);

    const data: TeamDetail | undefined = response?.data;
    if (!data?.team || !Array.isArray(data.members)) throw new Error('Failed to fetch team: unexpected response shape');

    return data;
}
