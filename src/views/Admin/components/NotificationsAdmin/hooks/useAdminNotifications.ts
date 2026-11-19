import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/context/ToastContext';
import reportApiError from '@/utils/reportApiError';
import getApiErrorMessage from '@/utils/getApiErrorMessage';
import {
    createNotification,
    EmailSource,
    deleteNotification,
    getNotifications,
    previewNotificationEmail,
    sendNotificationTest,
    updateNotification,
} from '../services/notificationsApi';
import { NotificationAction } from '../types';

const QUERY_KEY = ['admin-notifications'] as const;
const FEATURE = 'admin-notifications';

const SUCCESS: Record<NotificationAction, string> = {
    save: 'Notification saved.',
    schedule: 'Notification scheduled.',
    send_now: 'Sending now. It will show as Published once it is out.',
    unschedule: 'Moved back to drafts.',
    cancel: 'Notification canceled.',
};

export function useAdminNotifications() {
    const { data, isLoading, isError, error, isFetching, refetch } = useQuery({
        queryKey: QUERY_KEY,
        queryFn: getNotifications,
        // A notification sent now flips from Sending to Published in the background.
        refetchInterval: query =>
            query.state.data?.notifications.some(n => n.status === 'sending') ? 5000 : false,
    });

    useEffect(() => {
        if (error) reportApiError(error, { feature: FEATURE, operation: 'getNotifications' });
    }, [error]);

    return {
        notifications: data?.notifications ?? [],
        dryRun: data?.dryRun ?? false,
        isLoading,
        isError,
        isRetrying: isFetching && !isLoading,
        refetch,
    };
}

interface SaveArgs {
    id?: string;
    action: NotificationAction;
    fields?: object;
}

export function useSaveNotification() {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    const { mutate, isPending, variables } = useMutation({
        mutationFn: ({ id, action, fields }: SaveArgs) =>
            id ? updateNotification(id, action, fields) : createNotification(action, fields ?? {}),
        onSuccess: (_data, { action }) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
            // The in-app widget may show it (or stop showing it) right away.
            queryClient.invalidateQueries({ queryKey: ['get-user-notifications'] });
            showToast('success', SUCCESS[action]);
        },
        onError: error => {
            reportApiError(error, { feature: FEATURE, operation: 'saveNotification' });
            showToast('error', getApiErrorMessage(error, "Couldn't save the notification. Please try again."));
            // It may have been sent or changed since this list loaded.
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        },
    });

    return { save: mutate, isSaving: isPending, savingAction: isPending ? variables?.action : undefined };
}

export function useDeleteNotification() {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    const { mutate, isPending } = useMutation({
        mutationFn: (id: string) => deleteNotification(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: ['get-user-notifications'] });
            queryClient.invalidateQueries({ queryKey: ['get-dismissed-notifications'] });
            showToast('success', 'Notification deleted.');
        },
        onError: error => {
            reportApiError(error, { feature: FEATURE, operation: 'deleteNotification' });
            showToast('error', getApiErrorMessage(error, "Couldn't delete the notification. Please try again."));
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        },
    });

    return { remove: mutate, isDeleting: isPending };
}

export function useSendNotificationTest() {
    const { showToast } = useToast();

    const { mutate, isPending } = useMutation({
        mutationFn: ({ subject, source }: { subject: string; source: EmailSource }) => sendNotificationTest(subject, source),
        onSuccess: ({ to }) => showToast('success', `Test sent to ${to}.`),
        onError: error => {
            reportApiError(error, { feature: FEATURE, operation: 'sendNotificationTest' });
            showToast('error', getApiErrorMessage(error, "Couldn't send the test. Please try again."));
        },
    });

    return { sendTest: mutate, isSendingTest: isPending };
}

export function usePreviewNotificationEmail(source: EmailSource, enabled: boolean) {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['admin-notification-preview', JSON.stringify(source)],
        queryFn: () => previewNotificationEmail(source),
        enabled,
        staleTime: Infinity,
    });

    useEffect(() => {
        if (error) reportApiError(error, { feature: FEATURE, operation: 'previewNotificationEmail' });
    }, [error]);

    return { html: data, isLoading, isError };
}
