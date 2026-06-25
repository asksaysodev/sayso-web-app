import apiClient from '@/config/axios';

export interface SureSendPersonEmail {
    value?: string;
    type?: string;
    isPrimary?: boolean;
    status?: string;
}

export interface SureSendPersonPhone {
    value?: string;
    type?: string;
    isPrimary?: boolean;
    status?: string;
}

export interface SureSendPerson {
    id: string;
    firstName?: string;
    lastName?: string;
    name?: string;
    emails?: SureSendPersonEmail[];
    phones?: SureSendPersonPhone[];
    stage?: string;
    source?: string;
    [key: string]: unknown;
}

export interface SureSendPeopleMeta {
    total_count: number;
    current_page: number;
    total_pages: number;
    per_page: number;
}

export interface SureSendPeopleResponse {
    people: SureSendPerson[];
    meta: SureSendPeopleMeta | null;
}

export interface GetSureSendPeopleParams {
    page?: number;
    limit?: number;
    email?: string;
    phone?: string;
    matchAny?: string;
    includeTrash?: boolean;
}

export default async function getSureSendPeople(params?: GetSureSendPeopleParams): Promise<SureSendPeopleResponse> {
    const response = await apiClient.get<SureSendPeopleResponse>('/suresend/people', { params });
    if (!response?.data) throw new Error('Failed to fetch SureSend people');
    return response.data;
}
