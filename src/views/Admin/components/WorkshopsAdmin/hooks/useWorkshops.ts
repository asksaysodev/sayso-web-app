import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/context/ToastContext';
import reportApiError from '@/utils/reportApiError';
import getApiErrorMessage from '@/utils/getApiErrorMessage';
import { createWorkshop, getWorkshops, sendWorkshopTest, updateWorkshop } from '../services/workshopsApi';
import { WorkshopEmail, WorkshopInput } from '../types';

const WORKSHOPS_QUERY_KEY = ['admin-workshops'] as const;

export function useWorkshops() {
    const { data, isLoading, isError, error, isFetching, refetch } = useQuery({
        queryKey: WORKSHOPS_QUERY_KEY,
        queryFn: getWorkshops,
    });

    useEffect(() => {
        if (error) reportApiError(error, { feature: 'admin-workshops', operation: 'getWorkshops' });
    }, [error]);

    return { workshops: data ?? [], isLoading, isError, isRetrying: isFetching && !isLoading, refetch };
}

export function useSaveWorkshop() {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    const { mutate, isPending } = useMutation({
        mutationFn: ({ id, input }: { id?: string; input: WorkshopInput }) =>
            id ? updateWorkshop(id, input) : createWorkshop(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: WORKSHOPS_QUERY_KEY });
            showToast('success', 'Workshop saved.');
        },
        onError: (error) => {
            reportApiError(error, { feature: 'admin-workshops', operation: 'saveWorkshop' });
            showToast('error', getApiErrorMessage(error, "Couldn't save the workshop. Please try again."));
            // The workshop may have been locked by a send since this list loaded.
            queryClient.invalidateQueries({ queryKey: WORKSHOPS_QUERY_KEY });
        },
    });

    return { saveWorkshop: mutate, isSaving: isPending };
}

export function useSendWorkshopTest() {
    const { showToast } = useToast();

    const { mutate, isPending } = useMutation({
        mutationFn: ({ id, variant }: { id: string; variant: WorkshopEmail }) => sendWorkshopTest(id, variant),
        onSuccess: ({ to }) => showToast('success', `Test sent to ${to}.`),
        onError: (error) => {
            reportApiError(error, { feature: 'admin-workshops', operation: 'sendWorkshopTest' });
            showToast('error', getApiErrorMessage(error, "Couldn't send the test. Please try again."));
        },
    });

    return { sendTest: mutate, isSending: isPending };
}
