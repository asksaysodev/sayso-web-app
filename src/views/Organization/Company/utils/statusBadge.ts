import type { BadgeTone } from '@/components/ds/Badge';
import type { CompanyMemberStatus } from '../types';

const STATUS_BADGES: Record<CompanyMemberStatus, { label: string; tone: BadgeTone }> = {
    active: { label: 'Active', tone: 'success' },
    pending: { label: 'Invited', tone: 'primary' },
    expired: { label: 'Expired', tone: 'neutral' },
};

export default function statusBadge(status: CompanyMemberStatus) {
    return STATUS_BADGES[status];
}
