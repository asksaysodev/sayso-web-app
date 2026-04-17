import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import getNotifications from "../services/getNotifications"
import dismissNotification from "../services/dismissNotification"

interface Options {
    onDismissError?: (notificationId: string) => void;
}

export default function useNotificationWidget({ onDismissError }: Options = {}) {
    const queryClient = useQueryClient();

    const { data: userNotifications, isLoading } = useQuery({
        queryKey: ['get-user-notifications'],
        queryFn: getNotifications
    })

    const { mutate: mutateDismissNotification } = useMutation({
        mutationKey: ['mutate-dismiss-notification'],
        mutationFn: dismissNotification,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['get-user-notifications'] });
            queryClient.invalidateQueries({ queryKey: ['get-dismissed-notifications'] });
        },
        onError: (_err, notificationId) => {
            onDismissError?.(notificationId);
        },
    })

    return {
        userNotifications,
        isLoading,
        mutateDismissNotification
    }
}