import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import reportApiError from '@/utils/reportApiError';
import getCompanyMembers from '../services/getCompanyMembers';
import { COMPANY_MEMBERS_QUERY_KEY } from '@/views/Organization/shared/hooks/queryKeys';

export default function useCompanyMembers() {
    const { data, isLoading, isError, error, isFetching, refetch } = useQuery({
        queryKey: COMPANY_MEMBERS_QUERY_KEY,
        queryFn: getCompanyMembers,
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
