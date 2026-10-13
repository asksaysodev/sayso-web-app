import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import reportApiError from '@/utils/reportApiError';
import getDashboardOverview from '../services/getDashboardOverview';
import { dashboardQueryKeys } from '../queryKeys';
import shouldRetryQuery from '@/utils/shouldRetryQuery';
import useDashboardRequestScope from './useDashboardRequestScope';
import useResetScopeOnNotFound from './useResetScopeOnNotFound';
import type { OverviewPeriod } from '../types';

export default function useDashboardOverview(period: OverviewPeriod) {
    const { params, key } = useDashboardRequestScope();
    const { data, isError, error, refetch } = useQuery({
        queryKey: dashboardQueryKeys.overview(key, period),
        queryFn: () => getDashboardOverview(period, params),
        retry: shouldRetryQuery,
    });

    useResetScopeOnNotFound(error);

    useEffect(() => {
        if (error) reportApiError(error, { feature: 'dashboard', operation: 'getDashboardOverview' });
    }, [error]);

    return { overview: data ?? null, isError, retry: refetch };
}
