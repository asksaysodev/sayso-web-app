import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import type { BadgeTone } from '@/components/ds/Badge';
import formatPrice from '@/utils/formatters/formatPrice';
import type { GetAccountSubscriptionResponse } from '@/views/Subscription/types';

dayjs.extend(utc);

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

/** ["A", "B", "C"] → "A, B and C". */
export const joinList = (items: (string | number)[], conjunction: 'and' | 'or') =>
    items.length <= 1 ? items.join('') : `${items.slice(0, -1).join(', ')} ${conjunction} ${items[items.length - 1]}`;

/** Bill dates with the year once when they share it: "Nov 3 and Dec 3, 2026". */
export const formatBillDates = (dates: string[]) => {
    const isSameYear = new Set(dates.map((date) => date.slice(0, 4))).size === 1;
    if (!isSameYear) return joinList(dates.map((date) => formatBillingDate(date)), 'and');
    const days = joinList(dates.map((date) => formatBillingDate(date, 'MMM D')), 'and');
    return `${days}, ${formatBillingDate(dates[0], 'YYYY')}`;
};

export const formatMonths = (months: number) => `${months} ${months === 1 ? 'month' : 'months'}`;

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

/** Billing dates are UTC calendar days, as in the billing emails; local time could shift them by one. */
export const formatBillingDate = (date: string, format = 'MMM D, YYYY') => dayjs.utc(date).format(format);

export const formatDollars = (amount: number) => `$${formatPrice(amount, { keepCents: true })}`;

export const formatPriceWithInterval = (amount: number, interval: string | null) =>
    `${formatDollars(amount)}${interval ? ` / ${interval}` : ''}`;

export const intervalLabel = (interval: string | null) => {
    if (!interval) return null;
    return interval === 'month' ? 'Monthly' : 'Yearly';
};

export const isCancelling = (subscription: ActiveSubscription) =>
    subscription.status === 'canceled' || subscription.cancellation.pending || !!subscription.cancelledAt;

export const canStartCancellation = (subscription: ActiveSubscription) =>
    !subscription.isPartnerFunded && !isCancelling(subscription);

export type PlanStatusTone = 'success' | 'primary' | 'warning' | 'error';

export const planStatus = (subscription: ActiveSubscription): { label: string; tone: PlanStatusTone } => {
    if (subscription.status === 'canceled') return { label: 'Cancelled', tone: 'error' };
    if (isCancelling(subscription)) return { label: 'Cancelling', tone: 'warning' };
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
