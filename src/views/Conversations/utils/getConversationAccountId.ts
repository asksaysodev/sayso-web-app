import type { ConversationItem } from '@/types/coach';
import type { ScopeSelection } from '@/types/scope';

export default function getConversationAccountId(
    conversation: ConversationItem,
    selection: ScopeSelection | null,
): string | null {
    if (conversation.owner !== undefined) return conversation.owner?.accountId ?? null;
    return selection?.scope === 'account' ? selection.id : null;
}
