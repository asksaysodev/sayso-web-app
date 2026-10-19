import dayjs from 'dayjs';
import type { BadgeTone } from '@/components/ds/Badge';
import type { GetAccountSubscriptionResponse } from '@/views/Subscription/types';

export type ActiveSubscription = GetAccountSubscriptionResponse['subscription'];
export type Invoice = GetAccountSubscriptionResponse['invoices'][number];

export const formatInvoiceTotal = (invoice: Invoice) => {
    // Unpaid invoices have amount_paid = 0; show what is owed instead.
    const cents = invoice.status === 'paid' ? invoice.amount_paid_in_cents : invoice.amount_due_in_cents;
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: (invoice.currency || 'usd').toUpperCase(),
    }).format((cents ?? 0) / 100);
};

export const formatInvoiceDate = (invoice: Invoice) =>
    invoice.created_at ? dayjs(invoice.created_at).format('MMM D, YYYY') : '—';

/** Stripe invoice status → badge. `rank` orders the Status column. */
export const invoiceStatusBadge = (status: string | null): { label: string; tone: BadgeTone; rank: number } => {
    switch (status) {
        case 'paid':
            return { label: 'Paid', tone: 'success', rank: 2 };
        case 'open':
        case 'draft':
            return { label: 'Pending', tone: 'neutral', rank: 1 };
        case 'uncollectible':
        case 'void':
            return { label: 'Rejected', tone: 'error', rank: 0 };
        default:
            return { label: status ?? 'Unknown', tone: 'neutral', rank: 1 };
    }
};

export type PlanStatusTone = 'success' | 'primary' | 'warning' | 'error';

export const planStatus = (subscription: ActiveSubscription): { label: string; tone: PlanStatusTone } => {
    if (subscription.status === 'canceled') return { label: 'Cancelled', tone: 'error' };
    if (subscription.cancelledAt) return { label: 'Cancelling', tone: 'warning' };
    switch (subscription.status) {
        case 'trialing':
            return { label: 'Free trial', tone: 'primary' };
        case 'paused':
            return { label: 'Paused', tone: 'warning' };
        case 'past_due':
        case 'unpaid':
            return { label: 'Past due', tone: 'error' };
        default:
            return { label: 'Active', tone: 'success' };
    }
};
