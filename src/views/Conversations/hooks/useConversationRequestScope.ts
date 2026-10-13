import { useMemo } from 'react';
import useConversationScope from './useConversationScope';
import type { ConversationRequestParams } from '../types';

export default function useConversationRequestScope(): { params: ConversationRequestParams; key: string } {
    const { isAdmin, selection } = useConversationScope();

    return useMemo(() => {
        if (!isAdmin) return { params: {}, key: 'self' };
        if (!selection) return { params: { scope: 'company' }, key: 'company' };
        return {
            params: { scope: selection.scope, scopeId: selection.id },
            key: `${selection.scope}:${selection.id}`,
        };
    }, [isAdmin, selection]);
}
