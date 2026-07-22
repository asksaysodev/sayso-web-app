import { InvitationStatus } from '../types';
import { StatusTone } from './stripeStatusTone';

const toneMap: Record<InvitationStatus, StatusTone> = {
    claimed: 'green',
    pending: 'amber',
    cancelled: 'red',
};

export function invitationStatusTone(status: InvitationStatus): StatusTone {
    if (!status) return 'gray'
    return toneMap[status] ?? 'gray';
}
