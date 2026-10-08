import { useEffect } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import reportApiError from '@/utils/reportApiError';
import { teamDetailQueryKey } from '@/views/Organization/shared/hooks/queryKeys';
import getTeam from '../services/getTeam';

const MAX_RETRIES = 3;

const clientErrorStatus = (error: unknown): number | undefined => {
    const status = axios.isAxiosError(error) ? error.response?.status : undefined;
    return status !== undefined && status >= 400 && status < 500 ? status : undefined;
};

export default function useTeam(teamId: string) {
    const { data, isLoading, isError, error, isFetching, refetch } = useQuery({
        queryKey: teamDetailQueryKey(teamId),
        queryFn: () => getTeam(teamId),
        retry: (failureCount, err) => clientErrorStatus(err) === undefined && failureCount < MAX_RETRIES,
    });

    useEffect(() => {
        if (error) reportApiError(error, { feature: 'teams', operation: 'getTeam' });
    }, [error]);

    return {
        detail: data ?? null,
        isLoading,
        isError,
        isNotFound: clientErrorStatus(error) !== undefined,
        isRetrying: isFetching && !isLoading,
        retry: refetch,
    };
}
