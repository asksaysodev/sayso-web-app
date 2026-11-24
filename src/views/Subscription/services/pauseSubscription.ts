import apiClient from '@/config/axios';
import type { PauseOption, PauseSubscriptionResponse } from '../types';
import { RETENTION_ACTION_CONFIG } from './retentionRequest';

export default async function pauseSubscription({ months }: Pick<PauseOption, 'months'>): Promise<PauseSubscriptionResponse> {
    const response = await apiClient.post('/company/subscription/pause', { months }, RETENTION_ACTION_CONFIG);
    if (!response?.data) {
        throw new Error('Failed to pause subscription');
    }
    return response.data;
}
