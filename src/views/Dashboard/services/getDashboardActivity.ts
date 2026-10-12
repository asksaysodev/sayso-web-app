import apiClient from '@/config/axios';
import type { DashboardActivity, DashboardRequestParams } from '../types';

export default async function getDashboardActivity(
    weekOffset: number,
    params: DashboardRequestParams,
): Promise<DashboardActivity> {
    const response = await apiClient.get<DashboardActivity>('/dashboard/activity', { params: { ...params, weekOffset } });
    return response.data;
}
