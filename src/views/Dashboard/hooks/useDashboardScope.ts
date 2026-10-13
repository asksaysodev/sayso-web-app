import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import useIsTeamAdmin from '@/hooks/useIsTeamAdmin';
import parseScopeSelection from '@/utils/parseScopeSelection';
import type { ScopeSelection } from '@/types/scope';

/**
 * The Dashboard's team/member filter, kept in the URL so a scoped view survives reloads and can be shared.
 * Members always get `null`: their requests never carry a scope.
 */
export default function useDashboardScope() {
    const isAdmin = useIsTeamAdmin();
    const [searchParams, setSearchParams] = useSearchParams();

    const selection = useMemo(
        () => (isAdmin ? parseScopeSelection(searchParams) : null),
        [isAdmin, searchParams],
    );

    const setSelection = useCallback(
        (next: ScopeSelection | null) => {
            setSearchParams(
                (prev) => {
                    const params = new URLSearchParams(prev);
                    if (next) {
                        params.set('scope', next.scope);
                        params.set('scopeId', next.id);
                    } else {
                        params.delete('scope');
                        params.delete('scopeId');
                    }
                    return params;
                },
                { replace: true },
            );
        },
        [setSearchParams],
    );

    return { isAdmin, selection, setSelection };
}
