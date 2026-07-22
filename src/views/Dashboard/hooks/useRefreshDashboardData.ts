import { useQueryClient } from "@tanstack/react-query";

export default function useRefreshDashboardData() {
    const queryClient = useQueryClient();

    const refreshDashboardData = () => {
        queryClient.refetchQueries({ queryKey: ['dashboard-conversation-time'] });
        queryClient.refetchQueries({ queryKey: ['dashboard-weekly-activity'] });
        queryClient.refetchQueries({ queryKey: ['dashboard-conversations'] });
        queryClient.refetchQueries({ queryKey: ['coach-tips'] });
    }

    return {
        refreshDashboardData,
    }
}