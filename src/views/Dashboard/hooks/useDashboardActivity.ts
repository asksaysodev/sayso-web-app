import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import reportApiError from '@/utils/reportApiError';
import getDashboardActivity from '../services/getDashboardActivity';
import { dashboardQueryKeys } from '../queryKeys';
import shouldRetryDashboardQuery from '../utils/shouldRetryDashboardQuery';
import useDashboardRequestScope from './useDashboardRequestScope';
import useResetScopeOnNotFound from './useResetScopeOnNotFound';

export default function useDashboardActivity(weekOffset: number) {
    const { params, key } = useDashboardRequestScope();
    const { data, isError, isFetching, error, refetch } = useQuery({
        queryKey: dashboardQueryKeys.activity(key, weekOffset),
        queryFn: () => getDashboardActivity(weekOffset, params),
        retry: shouldRetryDashboardQuery,
    });

    useResetScopeOnNotFound(error);

    useEffect(() => {
        if (error) reportApiError(error, { feature: 'dashboard', operation: 'getDashboardActivity' });
    }, [error]);

    return { activity: data ?? null, isError, isRetrying: isError && isFetching, retry: refetch };
}
