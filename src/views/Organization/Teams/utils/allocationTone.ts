import { Check, CircleAlert, TriangleAlert, type LucideIcon } from 'lucide-react';
import type { ProgressBarTone } from '@/components/ds/ProgressBar';
import { NOTIFY_AT_PERCENT } from '../constants';

const CLOSE_TO_LIMIT_PERCENT = 95;

export interface AllocationTone {
    tone: ProgressBarTone;
    label: string;
    Icon: LucideIcon;
}

export default function allocationTone(capPercent: number): AllocationTone {
    if (capPercent >= CLOSE_TO_LIMIT_PERCENT) {
        return { tone: 'error', label: 'Team is close to its hour limit', Icon: CircleAlert };
    }
    if (capPercent >= NOTIFY_AT_PERCENT) {
        return { tone: 'warning', label: 'Approaching allocated hours limit', Icon: TriangleAlert };
    }
    return { tone: 'primary', label: 'Hours on track', Icon: Check };
}
