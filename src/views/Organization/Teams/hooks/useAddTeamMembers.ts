import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/context/ToastContext';
import reportApiError from '@/utils/reportApiError';
import getApiErrorMessage from '@/utils/getApiErrorMessage';
import {
    COMPANY_MEMBERS_QUERY_KEY,
    TEAM_DETAIL_QUERY_KEY,
    TEAMS_QUERY_KEY,
} from '@/views/Organization/shared/hooks/queryKeys';
import addTeamMembers from '../services/addTeamMembers';

export default function useAddTeamMembers() {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    const { mutate, isPending, error, reset } = useMutation({
        mutationFn: addTeamMembers,
        onSuccess: (_, { accountIds }) => {
            queryClient.invalidateQueries({ queryKey: TEAM_DETAIL_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: TEAMS_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: COMPANY_MEMBERS_QUERY_KEY });
            showToast('success', accountIds.length === 1 ? 'Member added.' : 'Members added.');
        },
        onError: (err) => {
            reportApiError(err, { feature: 'teams', operation: 'addTeamMembers' });
            if (axios.isAxiosError(err) && err.response?.status === 409) {
                queryClient.invalidateQueries({ queryKey: COMPANY_MEMBERS_QUERY_KEY });
            }
        },
    });

    return {
        addTeamMembers: mutate,
        isPending,
        errorMessage: error ? getApiErrorMessage(error, 'Failed to add members. Please try again.') : null,
        reset,
    };
}
