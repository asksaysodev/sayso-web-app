import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/context/ToastContext';
import reportApiError from '@/utils/reportApiError';
import getApiErrorMessage from '@/utils/getApiErrorMessage';
import updateInviteRole from '../services/updateInviteRole';
import { COMPANY_MEMBERS_QUERY_KEY } from './queryKeys';

export default function useUpdateInviteRole() {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    const { mutate, isPending, error, reset } = useMutation({
        mutationFn: updateInviteRole,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: COMPANY_MEMBERS_QUERY_KEY });
            showToast('success', 'Invite role updated.');
        },
        onError: (err) => {
            reportApiError(err, { feature: 'company-members', operation: 'updateInviteRole' });
        },
    });

    return {
        updateInviteRole: mutate,
        isPending,
        errorMessage: error ? getApiErrorMessage(error, 'Failed to update the invite role. Please try again.') : null,
        reset,
    };
}
