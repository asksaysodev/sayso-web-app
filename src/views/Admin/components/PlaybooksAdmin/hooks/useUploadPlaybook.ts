import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/context/ToastContext';
import reportApiError from '@/utils/reportApiError';
import getApiErrorMessage from '@/utils/getApiErrorMessage';
import { uploadPlaybook } from '../services/uploadPlaybook';
import { ADMIN_PLAYBOOKS_QUERY_KEY } from './queryKeys';

export function useUploadPlaybook() {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    const { mutate, isPending } = useMutation({
        mutationFn: uploadPlaybook,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ADMIN_PLAYBOOKS_QUERY_KEY });
            showToast('success', "Playbook uploaded. It's processing now.");
        },
        onError: (error) => {
            reportApiError(error, { feature: 'admin-playbooks', operation: 'uploadPlaybook' });
            showToast('error', getApiErrorMessage(error, 'Failed to upload playbook. Please try again.'));
        },
    });

    return { uploadPlaybook: mutate, isPending };
}
