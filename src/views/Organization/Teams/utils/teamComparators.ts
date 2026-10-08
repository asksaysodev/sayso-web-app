import type { Comparator } from '@/hooks/useSortableRows';
import type { TeamSummary } from '@/views/Organization/shared/types';
import type { TeamSortKey } from '../types';
import teamStatusBadge from './teamStatusBadge';

const byText = (a: string, b: string) => a.localeCompare(b, undefined, { sensitivity: 'base' });

/** Ascending comparator per sortable column; module-level so `useSortableRows` memoizes. */
export const TEAM_COMPARATORS: Record<TeamSortKey, Comparator<TeamSummary>> = {
    name: (a, b) => byText(a.name, b.name),
    members: (a, b) => a.member_count - b.member_count,
    // By allocation; an uncapped team sorts below any cap.
    hours: (a, b) => (a.capHours ?? -1) - (b.capHours ?? -1),
    status: (a, b) => teamStatusBadge(a.status).rank - teamStatusBadge(b.status).rank,
};
