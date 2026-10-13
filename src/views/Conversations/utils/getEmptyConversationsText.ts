import type { ScopeSelection } from '@/types/scope';

export default function getEmptyConversationsText(
    selection: ScopeSelection | null,
    isOwnSelection: boolean,
    isFiltered: boolean,
): string {
    const subject = (() => {
        if (!selection) return 'No conversations in your company';
        if (selection.scope === 'team') return 'No conversations for this team';
        return isOwnSelection ? 'No conversations' : 'No conversations for this member';
    })();
    return isFiltered ? `${subject} match your filters.` : `${subject} yet.`;
}
