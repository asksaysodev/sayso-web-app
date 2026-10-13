import type { Comparator } from '@/hooks/useSortableRows';
import { AdminPlaybook, PlaybookSortKey, PlaybookStatus } from '../types';
import playbookDisplayName from './playbookDisplayName';

const STATUS_ORDER: Record<PlaybookStatus, number> = { processing: 0, failed: 1, ready: 2 };

export const PLAYBOOK_COMPARATORS: Record<PlaybookSortKey, Comparator<AdminPlaybook>> = {
    name: (a, b) => playbookDisplayName(a).localeCompare(playbookDisplayName(b)),
    status: (a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status],
    defaultUsers: (a, b) => a.defaultUsersCount - b.defaultUsersCount,
    createdAt: (a, b) => a.createdAt.localeCompare(b.createdAt),
};
