import type { TeamSummary } from '@/views/Organization/shared/types';

/** `20 / 25h`, or `–` for an uncapped team. */
export default function formatAllocatedHours({ usedHours, capHours }: Pick<TeamSummary, 'usedHours' | 'capHours'>): string {
    return capHours === null ? '–' : `${usedHours} / ${capHours}h`;
}
