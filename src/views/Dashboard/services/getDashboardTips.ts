import apiClient from '@/config/axios';
import type { DashboardRequestParams, DashboardTips } from '../types';

export default async function getDashboardTips(params: DashboardRequestParams): Promise<DashboardTips> {
    const response = await apiClient.get<DashboardTips>('/dashboard/tips', { params });
    return response.data;
}
