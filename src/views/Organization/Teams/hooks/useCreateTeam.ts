import { useMutation, useQueryClient } from '@tanstack/react-query';
import reportApiError from '@/utils/reportApiError';
import { COMPANY_MEMBERS_QUERY_KEY, TEAMS_QUERY_KEY } from '@/views/Organization/shared/hooks/queryKeys';
import createTeam from '../services/createTeam';
import createTeamError from '../utils/createTeamError';

export default function useCreateTeam() {
    const queryClient = useQueryClient();

    const { mutate, isPending, data, error, reset } = useMutation({
        mutationFn: createTeam,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TEAMS_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: COMPANY_MEMBERS_QUERY_KEY });
        },
        onError: (err) => {
            reportApiError(err, { feature: 'teams', operation: 'createTeam' });
        },
    });

    return {
        createTeam: mutate,
        isPending,
        created: data ?? null,
        error: error ? createTeamError(error) : null,
        reset,
    };
}
