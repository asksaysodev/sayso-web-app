import type { DashboardSelection, DashboardSelectionScope } from '../types';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const isSelectionScope = (value: string | null): value is DashboardSelectionScope =>
    value === 'team' || value === 'account';

/** Reads `?scope=team|account&scopeId=<uuid>`; anything else is company level (`null`). */
export default function parseDashboardSelection(params: URLSearchParams): DashboardSelection | null {
    const scope = params.get('scope');
    const id = params.get('scopeId');
    if (!isSelectionScope(scope) || !id || !UUID_PATTERN.test(id)) return null;
    return { scope, id };
}
