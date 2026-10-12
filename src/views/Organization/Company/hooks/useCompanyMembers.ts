import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import reportApiError from '@/utils/reportApiError';
import getCompanyMembers from '../services/getCompanyMembers';
import { COMPANY_MEMBERS_QUERY_KEY } from '@/views/Organization/shared/hooks/queryKeys';

/**
 * Every member and open invite in the company.
 * @param enabled - Pass `false` to skip the fetch until it's needed.
 */
export default function useCompanyMembers(enabled = true) {
    const { data, isLoading, isError, error, isFetching, refetch } = useQuery({
        queryKey: COMPANY_MEMBERS_QUERY_KEY,
        queryFn: getCompanyMembers,
        enabled,
    });

    useEffect(() => {
        if (error) reportApiError(error, { feature: 'company-members', operation: 'getCompanyMembers' });
    }, [error]);

    return {
        members: data ?? [],
        isLoading,
        isError,
        isRetrying: isFetching && !isLoading,
        retry: refetch,
    };
}
