import apiClient from '@/config/axios';
import type { CrmLeadDetail, CrmUpdateLeadInput, CrmUpdateLeadResult, CrmProviderId } from '../types';

const BASE: Record<CrmProviderId, string> = {
    fub: 'fub/leads',
    suresend: 'suresend/people',
};

export async function getFubAccountDomain(): Promise<string | null> {
    const response = await apiClient.get<{ domain: string | null }>('fub/account');
    return response?.data?.domain ?? null;
}

export async function getCrmLeadDetail(providerId: CrmProviderId, id: string): Promise<CrmLeadDetail> {
    const response = await apiClient.get<{ lead: CrmLeadDetail }>(`${BASE[providerId]}/${encodeURIComponent(id)}`);
    if (!response?.data?.lead) throw new Error('Failed to load lead');
    return response.data.lead;
}

export async function updateCrmLeadDetail(
    providerId: CrmProviderId,
    id: string,
    input: CrmUpdateLeadInput,
): Promise<CrmUpdateLeadResult> {
    const response = await apiClient.put<{ lead: CrmLeadDetail; crm_lead_name: string }>(
        `${BASE[providerId]}/${encodeURIComponent(id)}`,
        input,
    );
    if (!response?.data?.lead) throw new Error('Failed to update lead');
    return { lead: response.data.lead, crmLeadName: response.data.crm_lead_name };
}
