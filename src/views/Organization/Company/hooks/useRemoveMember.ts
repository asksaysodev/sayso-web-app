import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/context/ToastContext';
import reportApiError from '@/utils/reportApiError';
import getApiErrorMessage from '@/utils/getApiErrorMessage';
import removeMember from '../services/removeMember';
import { COMPANY_MEMBERS_QUERY_KEY } from '@/views/Organization/shared/hooks/queryKeys';

export default function useRemoveMember() {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    const { mutate, isPending, error, reset } = useMutation({
        mutationFn: removeMember,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: COMPANY_MEMBERS_QUERY_KEY });
            showToast('success', 'Member removed.');
        },
        onError: (err) => {
            reportApiError(err, { feature: 'company-members', operation: 'removeMember' });
        },
    });

    return {
        removeMember: mutate,
        isPending,
        errorMessage: error ? getApiErrorMessage(error, 'Failed to remove member. Please try again.') : null,
        reset,
    };
}
