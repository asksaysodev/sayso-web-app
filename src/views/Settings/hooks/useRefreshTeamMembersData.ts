import { useQueryClient } from "@tanstack/react-query";

export default function useRefreshTeamMembersData() {
    const queryClient = useQueryClient();

    const refreshTeamMembersData = () => {
        queryClient.refetchQueries({ queryKey: ['get-organization-members'] });
    }

    return {
        refreshTeamMembersData,
    }
}
