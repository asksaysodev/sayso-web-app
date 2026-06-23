import apiClient from '@/config/axios';
import type { FubLead } from '@/types/fub';

export interface CreateFubLeadParams {
    firstName: string;
    lastName?: string;
    email?: string;
    phone?: string;
}

/**
 * Creates a new FUB lead (or returns the existing person on email/phone match via deduplicate=true).
 */
export default async function createFubLead(params: CreateFubLeadParams): Promise<FubLead> {
    const response = await apiClient.post<FubLead>('/fub/leads', params);
    if (!response?.data) throw new Error('Failed to create FUB lead');
    return response.data;
}
