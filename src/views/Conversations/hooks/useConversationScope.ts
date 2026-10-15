import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import useIsTeamAdmin from '@/hooks/useIsTeamAdmin';
import parseScopeSelection from '@/utils/parseScopeSelection';
import type { ScopeSelection } from '@/types/scope';

export default function useConversationScope() {
    const isAdmin = useIsTeamAdmin();
    const { globalUser } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const ownAccountId = globalUser?.id ?? '';

    const ownSelection = useMemo<ScopeSelection>(() => ({ scope: 'account', id: ownAccountId }), [ownAccountId]);

    const selection = useMemo(() => {
        if (!isAdmin) return ownSelection;
        if (searchParams.get('scope') === 'company') return null;
        return parseScopeSelection(searchParams) ?? ownSelection;
    }, [isAdmin, searchParams, ownSelection]);

    const isOwnSelection = selection?.scope === 'account' && selection.id === ownAccountId;

    const setSelection = useCallback(
        (next: ScopeSelection | null) => {
            setSearchParams(
                (prev) => {
                    const params = new URLSearchParams(prev);
                    if (!next) {
                        params.set('scope', 'company');
                        params.delete('scopeId');
                    } else if (next.scope === 'account' && next.id === ownAccountId) {
                        params.delete('scope');
                        params.delete('scopeId');
                    } else {
                        params.set('scope', next.scope);
                        params.set('scopeId', next.id);
                    }
                    return params;
                },
                { replace: true },
            );
        },
        [setSearchParams, ownAccountId],
    );

    const resetToOwn = useCallback(() => setSelection(ownSelection), [setSelection, ownSelection]);

    return { isAdmin, selection, isOwnSelection, setSelection, resetToOwn };
}
