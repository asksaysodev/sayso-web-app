import apiClient from "@/config/axios";

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
