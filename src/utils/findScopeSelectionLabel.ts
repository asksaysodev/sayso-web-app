import type { FilterOption, ScopeSelection } from '@/types/scope';

export default function findScopeSelectionLabel(selection: ScopeSelection | null, teams: FilterOption[], members: FilterOption[]): string | null {
    if (!selection) return null;
    const options = selection.scope === 'team' ? teams : members;
    return options.find((option) => option.id === selection.id)?.label ?? null;
}
