import type { Comparator } from '@/hooks/useSortableRows';
import displayName from '@/views/Organization/shared/utils/displayName';
import roleLabel from '@/views/Organization/shared/utils/roleLabel';
import type { TeamMember, TeamMemberSortKey } from '../types';

const byText = (a: string, b: string) => a.localeCompare(b, undefined, { sensitivity: 'base' });

const byLastConversation: Comparator<TeamMember> = (a, b) => {
    if (a.lastConversationAt === b.lastConversationAt) return 0;
    if (a.lastConversationAt === null) return 1;
    if (b.lastConversationAt === null) return -1;
    return Date.parse(a.lastConversationAt) - Date.parse(b.lastConversationAt);
};

export const TEAM_MEMBER_COMPARATORS: Record<TeamMemberSortKey, Comparator<TeamMember>> = {
    member: (a, b) => byText(displayName(a), displayName(b)),
    email: (a, b) => byText(a.email, b.email),
    role: (a, b) => byText(roleLabel(a.role), roleLabel(b.role)),
    lastConversation: byLastConversation,
};
