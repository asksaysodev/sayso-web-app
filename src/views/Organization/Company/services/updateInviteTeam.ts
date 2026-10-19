import apiClient from "@/config/axios";

export interface UpdateInviteTeamInput {
    inviteId: string;
    /** null = no team */
    teamId: string | null;
}

export default async function updateInviteTeam({ inviteId, teamId }: UpdateInviteTeamInput): Promise<void> {
    await apiClient.patch(`company/invite/team`, { inviteId, teamId });
}
