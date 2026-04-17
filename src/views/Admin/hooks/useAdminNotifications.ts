import { useQuery } from "@tanstack/react-query"
import { getNotificationsAdmin } from "../services/notificationService"

export default function useAdminNotifications() {
    
    const { data: notificationsbulk, isLoading, isRefetching } = useQuery({
        queryKey: ['get-notifications-bulk'],
        queryFn: getNotificationsAdmin
    })
    
    return {
        notificationsbulk,
        isLoading,
        isRefetching,
    }
}