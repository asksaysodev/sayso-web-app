import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/context/ToastContext';
import reportApiError from '@/utils/reportApiError';
import getApiErrorMessage from '@/utils/getApiErrorMessage';
import updateInviteTeam from '../services/updateInviteTeam';
import { COMPANY_MEMBERS_QUERY_KEY } from '@/views/Organization/shared/hooks/queryKeys';

export default function useUpdateInviteTeam() {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    const { mutate, isPending, error, reset } = useMutation({
        mutationFn: updateInviteTeam,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: COMPANY_MEMBERS_QUERY_KEY });
            showToast('success', 'Invite team updated.');
        },
        onError: (err) => {
            reportApiError(err, { feature: 'company-members', operation: 'updateInviteTeam' });
        },
    });

    return {
        updateInviteTeam: mutate,
        isPending,
        errorMessage: error ? getApiErrorMessage(error, 'Failed to update the invite team. Please try again.') : null,
        reset,
    };
}
