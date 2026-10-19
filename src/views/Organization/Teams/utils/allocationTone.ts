import { Check, CircleAlert, TriangleAlert, type LucideIcon } from 'lucide-react';
import type { ProgressBarTone } from '@/components/ds/ProgressBar';
import type { TeamStatus } from '@/views/Organization/shared/types';

export interface AllocationTone {
    tone: ProgressBarTone;
    label: string;
    Icon: LucideIcon;
}

const ALLOCATION_TONES: Record<TeamStatus, AllocationTone | null> = {
    on_track: { tone: 'primary', label: 'Hours on track', Icon: Check },
    approaching: { tone: 'warning', label: 'Approaching allocated hours limit', Icon: TriangleAlert },
    over: { tone: 'error', label: 'Team is over its hour limit', Icon: CircleAlert },
    no_cap: null,
};

/** How the allocated-hours meter renders a team status; `null` when there is no cap to meter. */
export default function allocationTone(status: TeamStatus): AllocationTone | null {
    return ALLOCATION_TONES[status];
}
