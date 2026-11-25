import apiClient from '@/config/axios';
import type { ApplyRetentionDiscountRequest, RetentionDiscount } from '../types';
import { RETENTION_ACTION_CONFIG } from './retentionRequest';

export default async function applyRetentionDiscount(request: ApplyRetentionDiscountRequest): Promise<RetentionDiscount> {
    const response = await apiClient.post('/company/subscription/retention-discount', request, RETENTION_ACTION_CONFIG);
    if (!response?.data) {
        throw new Error('Failed to apply discount');
    }
    return response.data;
}
