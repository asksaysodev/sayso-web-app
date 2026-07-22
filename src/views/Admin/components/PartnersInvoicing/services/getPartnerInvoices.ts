import apiClient from '@/config/axios';
import { InvoiceStatus, PartnerInvoicesData } from '../types';

interface PartnerInvoiceResponse {
    id: string;
    number: string | null;
    status: InvoiceStatus;
    is_overdue: boolean;
    line_count: number;
    amount_due: number;
    amount_paid: number;
    amount_remaining: number;
    currency: string;
    created_at: string | null;
    due_date: string | null;
    hosted_invoice_url: string | null;
    invoice_pdf: string | null;
}

export async function getPartnerInvoices(partnerId: string): Promise<PartnerInvoicesData> {
    const response = await apiClient.get(`/admin/partners/${partnerId}/invoices`);

    const invoices: PartnerInvoiceResponse[] | undefined = response?.data?.data;
    if (!Array.isArray(invoices)) throw new Error('Failed to fetch invoices: unexpected response shape');

    return {
        stripeCustomerUrl: response?.data?.stripe_customer_url ?? null,
        invoices: invoices.map(invoice => ({
            id: invoice.id,
            number: invoice.number,
            status: invoice.status,
            isOverdue: invoice.is_overdue,
            lineCount: invoice.line_count ?? 0,
            amountDue: invoice.amount_due,
            amountPaid: invoice.amount_paid,
            amountRemaining: invoice.amount_remaining,
            currency: invoice.currency,
            createdAt: invoice.created_at,
            dueDate: invoice.due_date,
            hostedInvoiceUrl: invoice.hosted_invoice_url,
            invoicePdf: invoice.invoice_pdf,
        })),
    };
}
