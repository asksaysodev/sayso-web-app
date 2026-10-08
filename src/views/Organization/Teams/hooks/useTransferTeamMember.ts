import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/context/ToastContext';
import reportApiError from '@/utils/reportApiError';
import getApiErrorMessage from '@/utils/getApiErrorMessage';
import {
    COMPANY_MEMBERS_QUERY_KEY,
    TEAM_DETAIL_QUERY_KEY,
    TEAMS_QUERY_KEY,
} from '@/views/Organization/shared/hooks/queryKeys';
import transferTeamMember from '../services/transferTeamMember';

export default function useTransferTeamMember() {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    const { mutate, isPending, error, reset } = useMutation({
        mutationFn: transferTeamMember,
        onSuccess: (_, { toTeamName }) => {
            queryClient.invalidateQueries({ queryKey: TEAM_DETAIL_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: TEAMS_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: COMPANY_MEMBERS_QUERY_KEY });
            showToast('success', `Member transferred to ${toTeamName}.`);
        },
        onError: (err) => {
            reportApiError(err, { feature: 'teams', operation: 'transferTeamMember' });
        },
    });

    return {
        transferMember: mutate,
        isPending,
        errorMessage: error ? getApiErrorMessage(error, 'Failed to transfer member. Please try again.') : null,
        reset,
    };
}
