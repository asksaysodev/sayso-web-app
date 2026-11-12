import apiClient from '@/config/axios';
import type { FubLead } from '@/types/fub';

export interface CreateFubLeadParams {
    firstName: string;
    lastName?: string;
    email?: string;
    phone?: string;
}

export interface CreateFubLeadResult {
    person: FubLead;
    created: boolean;
}

/**
 * Creates a FUB lead with deduplicate=true. FUB answers 201 for a new person and
 * 200 with the existing person (unchanged) when the email or phone matches.
 */
export default async function createFubLead(params: CreateFubLeadParams): Promise<CreateFubLeadResult> {
    const response = await apiClient.post<FubLead>('/fub/leads', params);
    if (!response?.data) throw new Error('Failed to create FUB lead');
    return { person: response.data, created: response.status === 201 };
}
