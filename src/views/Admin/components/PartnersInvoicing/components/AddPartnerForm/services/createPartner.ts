import apiClient from "@/config/axios";
import type { CreatePartnerPayload } from '../types';

export async function createPartner(payload: CreatePartnerPayload): Promise<{ id: string }> {
    const response = await apiClient.post('/admin/partners', {
        name: payload.name,
        billing_email: payload.billingEmail,
        net_terms: payload.netTerms,
    });
    if (!response?.data?.data?.id) throw new Error('Failed to create partner');
    return { id: response.data.data.id };
}
