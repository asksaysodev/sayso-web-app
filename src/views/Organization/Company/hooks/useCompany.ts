import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import reportApiError from '@/utils/reportApiError';
import getCompany from '../services/getCompany';
import { COMPANY_QUERY_KEY } from '@/views/Organization/shared/hooks/queryKeys';

export default function useCompany() {
    const { data, isLoading, error } = useQuery({
        queryKey: COMPANY_QUERY_KEY,
        queryFn: getCompany,
    });

    useEffect(() => {
        if (error) reportApiError(error, { feature: 'company', operation: 'getCompany' });
    }, [error]);

    return { company: data ?? null, isLoading };
}
