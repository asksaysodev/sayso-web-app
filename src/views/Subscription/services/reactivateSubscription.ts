import apiClient from '@/config/axios';
import type { ReactivateSubscriptionResponse } from '../types';
import { RETENTION_ACTION_CONFIG } from './retentionRequest';

export default async function reactivateSubscription(): Promise<ReactivateSubscriptionResponse> {
    const response = await apiClient.post('/company/subscription/reactivate', {}, RETENTION_ACTION_CONFIG);
    if (!response?.data) {
        throw new Error('Failed to reactivate subscription');
    }
    return response.data;
}
