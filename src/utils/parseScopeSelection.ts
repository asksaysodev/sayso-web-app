import type { ScopeSelection, ScopeSelectionScope } from '@/types/scope';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const isSelectionScope = (value: string | null): value is ScopeSelectionScope => {
    return value === 'team' || value === 'account';
}

export default function parseScopeSelection(params: URLSearchParams): ScopeSelection | null {
    const scope = params.get('scope');
    const id = params.get('scopeId');
    if (!isSelectionScope(scope) || !id || !UUID_PATTERN.test(id)) return null;
    return { scope, id };
}
