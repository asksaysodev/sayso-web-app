import { StripeStatus } from '../types';

export type StatusTone = 'green' | 'amber' | 'red' | 'gray';

const toneMap: Record<StripeStatus, StatusTone> = {
    active: 'green',
    past_due: 'amber',
    canceled: 'red',
    unpaid: 'red',
    incomplete: 'gray',
};

export function stripeStatusTone(status: StripeStatus): StatusTone {
    return toneMap[status] ?? 'gray';
}
