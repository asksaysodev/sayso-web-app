import type { BadgeTone } from '@/components/ds/Badge';
import { PlaybookStatus } from '../types';

const STATUS_BADGE: Record<PlaybookStatus, { label: string; tone: BadgeTone }> = {
    ready: { label: 'Ready', tone: 'success' },
    processing: { label: 'Processing', tone: 'primary' },
    failed: { label: 'Failed', tone: 'error' },
};

export default function statusBadge(status: PlaybookStatus) {
    return STATUS_BADGE[status];
}
