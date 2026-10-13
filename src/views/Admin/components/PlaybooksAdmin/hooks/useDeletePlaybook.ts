import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/context/ToastContext';
import reportApiError from '@/utils/reportApiError';
import getApiErrorMessage from '@/utils/getApiErrorMessage';
import { deletePlaybook } from '../services/deletePlaybook';
import { AdminPlaybook } from '../types';
import { ADMIN_PLAYBOOKS_QUERY_KEY } from './queryKeys';

export function useDeletePlaybook() {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    const { mutate, isPending } = useMutation({
        mutationFn: deletePlaybook,
        onSuccess: (_data, playbookId) => {
            queryClient.setQueryData<AdminPlaybook[]>(
                ADMIN_PLAYBOOKS_QUERY_KEY,
                current => current?.filter(playbook => playbook.id !== playbookId),
            );
            queryClient.invalidateQueries({ queryKey: ADMIN_PLAYBOOKS_QUERY_KEY });
            showToast('success', 'Playbook deleted.');
        },
        onError: (error) => {
            reportApiError(error, { feature: 'admin-playbooks', operation: 'deletePlaybook' });
            showToast('error', getApiErrorMessage(error, 'Failed to delete playbook. Please try again.'));
        },
    });

    return { deletePlaybook: mutate, isPending };
}
