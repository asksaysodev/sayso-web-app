import apiClient from '@/config/axios';

export interface SureSendStage {
    id: string;
    name: string;
    active: boolean;
}

export default async function getSureSendStages(): Promise<SureSendStage[]> {
    const response = await apiClient.get<{ stages: SureSendStage[] }>('/suresend/stages');
    return response.data?.stages ?? [];
}
