import apiClient from '@/config/axios';
import type { SureSendPerson } from './getSureSendPeople';

export interface CreateSureSendLeadParams {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    stage: string;
}

/** Creates a SureSend person. Not auto-retried: SureSend doesn't deduplicate, so a retry after a lost response would create a duplicate. */
export default async function createSureSendLead(params: CreateSureSendLeadParams): Promise<SureSendPerson> {
    const response = await apiClient.post<SureSendPerson>('/suresend/people', params, { skipRetry: true });
    if (!response?.data) throw new Error('Failed to create Sure Send lead');
    return response.data;
}
