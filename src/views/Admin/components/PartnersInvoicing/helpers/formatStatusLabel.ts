import { InvitationStatus, InvoiceStatus, StripeStatus } from '../types';

const stripeLabels: Record<StripeStatus, string> = {
    active: 'Active',
    past_due: 'Past due',
    canceled: 'Canceled',
    unpaid: 'Unpaid',
    incomplete: 'Incomplete',
};

const invitationLabels: Record<InvitationStatus, string> = {
    pending: 'Pending',
    claimed: 'Claimed',
    cancelled: 'Cancelled',
};

export function formatStripeStatusLabel(status: StripeStatus): string {
    return stripeLabels[status] ?? status;
}

export function formatInvitationStatusLabel(status: InvitationStatus): string {
    return invitationLabels[status] ?? status;
}

const invoiceLabels: Record<InvoiceStatus, string> = {
    draft: 'Draft',
    open: 'Open',
    paid: 'Paid',
    uncollectible: 'Uncollectible',
    void: 'Void',
};

export function formatInvoiceStatusLabel(status: InvoiceStatus, isOverdue: boolean): string {
    if (isOverdue) return 'Past due';
    return invoiceLabels[status] ?? status;
}
