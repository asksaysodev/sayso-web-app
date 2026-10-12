import apiClient from '@/config/axios';
import type { DashboardOverview, DashboardRequestParams, OverviewPeriod } from '../types';

export default async function getDashboardOverview(
    period: OverviewPeriod,
    params: DashboardRequestParams,
): Promise<DashboardOverview> {
    const response = await apiClient.get<DashboardOverview>('/dashboard/overview', { params: { ...params, period } });
    return response.data;
}
