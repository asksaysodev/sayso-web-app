import apiClient from '@/config/axios';
import type { SureSendPerson } from './getSureSendPeople';

export interface CreateSureSendLeadParams {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    stage: string;
}

export default async function createSureSendLead(params: CreateSureSendLeadParams): Promise<SureSendPerson> {
    const response = await apiClient.post<SureSendPerson>('/suresend/people', params);
    if (!response?.data) throw new Error('Failed to create SureSend lead');
    return response.data;
}
