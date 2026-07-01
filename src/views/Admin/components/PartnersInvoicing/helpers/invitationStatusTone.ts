import { InvitationStatus } from '../types';
import { StatusTone } from './stripeStatusTone';

const toneMap: Record<InvitationStatus, StatusTone> = {
    claimed: 'green',
    pending: 'amber',
    cancelled: 'red',
};

export function invitationStatusTone(status: InvitationStatus): StatusTone {
    return toneMap[status] ?? 'gray';
}
