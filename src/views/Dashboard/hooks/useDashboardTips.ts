import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import reportApiError from '@/utils/reportApiError';
import getDashboardTips from '../services/getDashboardTips';
import { dashboardQueryKeys } from '../queryKeys';
import shouldRetryDashboardQuery from '../utils/shouldRetryDashboardQuery';
import useDashboardRequestScope from './useDashboardRequestScope';
import useResetScopeOnNotFound from './useResetScopeOnNotFound';

export default function useDashboardTips() {
    const { params, key } = useDashboardRequestScope();
    const { data, isError, isFetching, error, refetch } = useQuery({
        queryKey: dashboardQueryKeys.tips(key),
        queryFn: () => getDashboardTips(params),
        retry: shouldRetryDashboardQuery,
    });

    useResetScopeOnNotFound(error);

    useEffect(() => {
        if (error) reportApiError(error, { feature: 'dashboard', operation: 'getDashboardTips' });
    }, [error]);

    return { tips: data?.tips ?? null, scopeKey: key, isError, isRetrying: isError && isFetching, retry: refetch };
}
