import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/context/ToastContext';
import reportApiError from '@/utils/reportApiError';
import getApiErrorMessage from '@/utils/getApiErrorMessage';
import revokeInvite from '../services/revokeInvite';
import { COMPANY_MEMBERS_QUERY_KEY } from '@/views/Organization/shared/hooks/queryKeys';

export default function useRevokeInvite() {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    const { mutate, isPending, error, reset } = useMutation({
        mutationFn: revokeInvite,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: COMPANY_MEMBERS_QUERY_KEY });
            showToast('success', 'Invite revoked.');
        },
        onError: (err) => {
            reportApiError(err, { feature: 'company-members', operation: 'revokeInvite' });
        },
    });

    return {
        revokeInvite: mutate,
        isPending,
        errorMessage: error ? getApiErrorMessage(error, 'Failed to revoke invite. Please try again.') : null,
        reset,
    };
}
