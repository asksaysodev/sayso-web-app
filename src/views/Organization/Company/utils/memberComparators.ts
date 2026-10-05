import type { Comparator } from '@/hooks/useSortableRows';
import type { CompanyMemberRow, MemberSortKey } from '../types';
import displayName from '@/views/Organization/shared/utils/displayName';
import roleLabel from './roleLabel';
import statusBadge from './statusBadge';

const byText = (a: string, b: string) => a.localeCompare(b, undefined, { sensitivity: 'base' });

/** Ascending comparator per sortable column; module-level so `useSortableRows` memoizes. */
export const MEMBER_COMPARATORS: Record<MemberSortKey, Comparator<CompanyMemberRow>> = {
    member: (a, b) => byText(displayName(a), displayName(b)),
    email: (a, b) => byText(a.email, b.email),
    role: (a, b) => byText(roleLabel(a.role), roleLabel(b.role)),
    status: (a, b) => byText(statusBadge(a.status).label, statusBadge(b.status).label),
};
