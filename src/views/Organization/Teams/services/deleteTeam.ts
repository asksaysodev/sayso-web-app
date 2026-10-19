import apiClient from "@/config/axios";

export default async function deleteTeam(teamId: string): Promise<void> {
    await apiClient.delete(`teams/${teamId}`);
}
