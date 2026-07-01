import { InvitationStatus, StripeStatus } from '../types';

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
