import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import reportApiError from '@/utils/reportApiError';
import getTeams from '../services/getTeams';
import { TEAMS_QUERY_KEY } from './queryKeys';

/**
 * Team options for the invite modal.
 * @param enabled - Pass `false` while the modal is closed to skip the fetch.
 */
export default function useTeams(enabled = true) {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: TEAMS_QUERY_KEY,
        queryFn: getTeams,
        enabled,
    });

    useEffect(() => {
        if (error) reportApiError(error, { feature: 'company-members', operation: 'getTeams' });
    }, [error]);

    return { teams: data ?? [], isLoading, isError };
}
