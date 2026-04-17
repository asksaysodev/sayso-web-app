import { useQuery } from "@tanstack/react-query"
import { getNotificationsAdmin } from "../services/notificationService"

export default function useAdminNotifications() {
    
    const { data: notifications, isLoading, isRefetching } = useQuery({
        queryKey: ['get-notifications-bulk'],
        queryFn: getNotificationsAdmin
    })

    return {
        notifications,
        isLoading,
        isRefetching,
    }
}