import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/context/ToastContext';
import reportApiError from '@/utils/reportApiError';
import getApiErrorMessage from '@/utils/getApiErrorMessage';
import {
    COMPANY_MEMBERS_QUERY_KEY,
    TEAMS_QUERY_KEY,
    teamDetailQueryKey,
} from '@/views/Organization/shared/hooks/queryKeys';
import deleteTeam from '../services/deleteTeam';

export default function useDeleteTeam() {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    const { mutate, isPending, error } = useMutation({
        mutationFn: deleteTeam,
        onSuccess: (_, teamId) => {
            queryClient.removeQueries({ queryKey: teamDetailQueryKey(teamId) });
            queryClient.invalidateQueries({ queryKey: TEAMS_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: COMPANY_MEMBERS_QUERY_KEY });
            showToast('success', 'Team deleted.');
        },
        onError: (err) => {
            reportApiError(err, { feature: 'teams', operation: 'deleteTeam' });
        },
    });

    return {
        deleteTeam: mutate,
        isPending,
        errorMessage: error ? getApiErrorMessage(error, 'Failed to delete team. Please try again.') : null,
    };
}
