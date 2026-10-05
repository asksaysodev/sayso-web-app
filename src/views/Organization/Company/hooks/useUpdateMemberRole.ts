import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/context/ToastContext';
import reportApiError from '@/utils/reportApiError';
import getApiErrorMessage from '@/utils/getApiErrorMessage';
import updateMemberRole from '../services/updateMemberRole';
import { COMPANY_MEMBERS_QUERY_KEY } from '@/views/Organization/shared/hooks/queryKeys';

export default function useUpdateMemberRole() {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    const { mutate, isPending, error, reset } = useMutation({
        mutationFn: updateMemberRole,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: COMPANY_MEMBERS_QUERY_KEY });
            showToast('success', 'Role updated.');
        },
        onError: (err) => {
            reportApiError(err, { feature: 'company-members', operation: 'updateMemberRole' });
        },
    });

    return {
        updateRole: mutate,
        isPending,
        errorMessage: error ? getApiErrorMessage(error, 'Failed to update role. Please try again.') : null,
        reset,
    };
}
