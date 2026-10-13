import { useMemo } from 'react';
import type { ScopeSelection } from '@/types/scope';
import type { ConversationRequestParams } from '../types';

export default function useConversationRequestScope(
    isAdmin: boolean,
    selection: ScopeSelection | null,
): { params: ConversationRequestParams; key: string } {
    return useMemo(() => {
        if (!isAdmin) return { params: {}, key: 'self' };
        if (!selection) return { params: { scope: 'company' }, key: 'company' };
        return {
            params: { scope: selection.scope, scopeId: selection.id },
            key: `${selection.scope}:${selection.id}`,
        };
    }, [isAdmin, selection]);
}
