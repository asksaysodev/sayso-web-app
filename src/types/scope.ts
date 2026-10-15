export type ScopeSelectionScope = 'team' | 'account';

export interface ScopeSelection {
    scope: ScopeSelectionScope;
    id: string;
}

export interface FilterOption {
    id: string;
    label: string;
}

export interface FilterOptionList {
    options: FilterOption[];
    isLoading: boolean;
    isError: boolean;
    isRetrying: boolean;
    retry: () => void;
}
