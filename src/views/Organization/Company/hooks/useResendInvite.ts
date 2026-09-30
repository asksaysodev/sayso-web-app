import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/context/ToastContext';
import reportApiError from '@/utils/reportApiError';
import getApiErrorMessage from '@/utils/getApiErrorMessage';
import resendInvite from '../services/resendInvite';
import { COMPANY_MEMBERS_QUERY_KEY } from './queryKeys';

export default function useResendInvite() {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    const { mutate, isPending } = useMutation({
        mutationFn: resendInvite,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: COMPANY_MEMBERS_QUERY_KEY });
            showToast('success', 'Invite resent.');
        },
        onError: (err) => {
            reportApiError(err, { feature: 'company-members', operation: 'resendInvite' });
            showToast('error', getApiErrorMessage(err, 'Failed to resend invite. Please try again.'));
        },
    });

    return { resendInvite: mutate, isPending };
}
