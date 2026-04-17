import { useQuery } from "@tanstack/react-query"
import getDismissedNotifications from "../services/getDismissedNotifications"

export default function useDismissedNotifications() {
    
    const { data: dismissedNotifications, isLoading: isLoadingDismissedNotifications } = useQuery({
        queryKey: ['get-dismissed-notifications'],
        queryFn: getDismissedNotifications
    })
    
    return { dismissedNotifications,isLoadingDismissedNotifications };
}