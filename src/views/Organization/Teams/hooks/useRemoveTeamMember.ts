import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/context/ToastContext';
import reportApiError from '@/utils/reportApiError';
import getApiErrorMessage from '@/utils/getApiErrorMessage';
import {
    COMPANY_MEMBERS_QUERY_KEY,
    TEAM_DETAIL_QUERY_KEY,
    TEAMS_QUERY_KEY,
} from '@/views/Organization/shared/hooks/queryKeys';
import removeTeamMember from '../services/removeTeamMember';

export default function useRemoveTeamMember() {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    const { mutate, isPending, error } = useMutation({
        mutationFn: removeTeamMember,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TEAM_DETAIL_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: TEAMS_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: COMPANY_MEMBERS_QUERY_KEY });
            showToast('success', 'Member removed from team.');
        },
        onError: (err) => {
            reportApiError(err, { feature: 'teams', operation: 'removeTeamMember' });
        },
    });

    return {
        removeTeamMember: mutate,
        isPending,
        errorMessage: error ? getApiErrorMessage(error, 'Failed to remove member from team. Please try again.') : null,
    };
}
