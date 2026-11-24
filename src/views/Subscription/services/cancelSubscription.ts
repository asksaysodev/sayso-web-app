import apiClient from '@/config/axios';
import type { CancellationFeedback, CancelSubscriptionResponse } from '../types';
import { RETENTION_ACTION_CONFIG } from './retentionRequest';

export default async function cancelSubscription(feedback: CancellationFeedback): Promise<CancelSubscriptionResponse> {
    const response = await apiClient.post('/company/subscription/cancel', feedback, RETENTION_ACTION_CONFIG);
    if (!response?.data) {
        throw new Error('Failed to cancel subscription');
    }
    return response.data;
}
