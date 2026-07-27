import apiClient from '@/config/axios';

export async function resendPartnerInvoice(partnerId: string, invoiceId: string): Promise<void> {
    await apiClient.post(`/admin/partners/${partnerId}/invoices/${invoiceId}/resend`);
}
