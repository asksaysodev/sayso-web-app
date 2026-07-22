import dayjs from 'dayjs';
import { PartnerInvoice } from '../types';

export interface InvoiceStats {
    outstanding: number;
    paidYtd: number;
    pastDueCount: number;
    total: number;
    currency: string;
}

export function computeInvoiceStats(invoices: PartnerInvoice[]): InvoiceStats {
    const currentYear = dayjs().year();

    return {
        outstanding: invoices
            .filter(invoice => invoice.status === 'open')
            .reduce((sum, invoice) => sum + invoice.amountDue, 0),
        paidYtd: invoices
            .filter(invoice => invoice.status === 'paid' && invoice.createdAt && dayjs(invoice.createdAt).year() === currentYear)
            .reduce((sum, invoice) => sum + invoice.amountPaid, 0),
        pastDueCount: invoices.filter(invoice => invoice.isOverdue).length,
        total: invoices.length,
        currency: invoices[0]?.currency ?? 'usd',
    };
}
