import apiClient from '@/config/axios';
import type { RetentionOptions } from '../types';

export default async function getRetentionOptions(): Promise<RetentionOptions> {
    const response = await apiClient.get('/company/subscription/retention-options');
    if (!response?.data) {
        throw new Error('Failed to fetch retention options');
    }
    return response.data;
}
