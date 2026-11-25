import apiClient from '@/config/axios';
import type { ResumeSubscriptionRequest, ResumeSubscriptionResponse } from '../types';
import { RETENTION_ACTION_CONFIG } from './retentionRequest';

export default async function resumeSubscription(request: ResumeSubscriptionRequest): Promise<ResumeSubscriptionResponse> {
    const response = await apiClient.post('/company/subscription/resume', request, RETENTION_ACTION_CONFIG);
    if (!response?.data) {
        throw new Error('Failed to resume subscription');
    }
    return response.data;
}
