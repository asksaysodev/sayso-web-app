import type { BadgeTone } from '@/components/ds/Badge';
import type { TeamStatus } from '@/views/Organization/shared/types';

const STATUS_BADGES: Record<TeamStatus, { label: string; tone: BadgeTone; rank: number }> = {
    over: { label: 'Over', tone: 'error', rank: 0 },
    approaching: { label: 'Approaching', tone: 'warning', rank: 1 },
    on_track: { label: 'On track', tone: 'neutral', rank: 2 },
    no_cap: { label: 'No cap set', tone: 'neutral', rank: 3 },
};

/** Badge for the server's `status`; `rank` orders by severity, most urgent first. */
export default function teamStatusBadge(status: TeamStatus) {
    return STATUS_BADGES[status];
}
