import { useQueryClient } from "@tanstack/react-query";

export default function useRefreshDashboardData() {
    const queryClient = useQueryClient();

    const refreshDashboardData = () => {
        queryClient.refetchQueries({ queryKey: ['dashboard-account-usage'] });
        queryClient.refetchQueries({ queryKey: ['dashboard-weekly-activity'] });
        queryClient.refetchQueries({ queryKey: ['dashboard-insights'] });
    }

    return {
        refreshDashboardData,
    }
}