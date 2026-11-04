import apiClient from "@/config/axios";
import type { ConversationSmartCapture } from "@/types/coach";

export interface UpdateConversationLeadPayload {
    crm_lead_id: string | null;
    crm_lead_name: string | null;
    crm_provider: string | null;
}

export interface UpdateConversationLeadResponse {
    id: string;
    crm_lead_id: string | null;
    crm_lead_name: string | null;
    crm_provider: string | null;
    crm_lead_linked_at: string | null;
}

export async function updateConversationLead(
    conversationId: string,
    payload: UpdateConversationLeadPayload
): Promise<UpdateConversationLeadResponse> {
    const response = await apiClient.patch(`conversations/${conversationId}`, payload);
    if (!response?.data) throw new Error('Failed to update conversation');
    return response.data;
}

export async function updateConversationSmartCaptures(
    conversationId: string,
    captures: Record<string, string>
): Promise<ConversationSmartCapture[]> {
    const response = await apiClient.patch(`conversations/${conversationId}/smart-captures`, { captures });
    if (!response?.data?.smart_captures) throw new Error('Failed to update smart captures');
    return response.data.smart_captures;
}

export type CrmResyncResult = 'ok' | 'failed' | 'reauth_required';

export async function resyncConversationCrm(conversationId: string): Promise<CrmResyncResult> {
    const response = await apiClient.post(`conversations/${conversationId}/crm-resync`);
    if (!response?.data?.resync) throw new Error('Failed to resync conversation');
    return response.data.resync;
}
