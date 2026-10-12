import type { DashboardSelection, FilterOption } from '../types';

/** Name of the selected team/member, or `null` when nothing is selected or the lists don't have it (yet). */
export default function findSelectionLabel(
    selection: DashboardSelection | null,
    teams: FilterOption[],
    members: FilterOption[],
): string | null {
    if (!selection) return null;
    const options = selection.scope === 'team' ? teams : members;
    return options.find((option) => option.id === selection.id)?.label ?? null;
}
