import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/context/ToastContext';
import reportApiError from '@/utils/reportApiError';
import { TEAMS_QUERY_KEY, teamDetailQueryKey } from '@/views/Organization/shared/hooks/queryKeys';
import updateTeam from '../services/updateTeam';
import teamError from '../utils/teamError';

export default function useUpdateTeam() {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    const { mutate, isPending, error, reset } = useMutation({
        mutationFn: updateTeam,
        onSuccess: (_, { teamId }) => {
            queryClient.invalidateQueries({ queryKey: teamDetailQueryKey(teamId) });
            queryClient.invalidateQueries({ queryKey: TEAMS_QUERY_KEY });
            showToast('success', 'Team updated.');
        },
        onError: (err) => {
            reportApiError(err, { feature: 'teams', operation: 'updateTeam' });
        },
    });

    return {
        updateTeam: mutate,
        isPending,
        error: error ? teamError(error, 'Failed to update team. Please try again.') : null,
        reset,
    };
}
