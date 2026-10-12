export type WeeklyActivityDirection = 'prev' | 'next';
export type InsightRating = null | 'up' | 'down';

export interface ConversationTimeProps {
    totalMinutes: number;
    isRefetching: boolean;
    isLoading: boolean;
}

export type DashboardSelectionScope = 'team' | 'account';

/** A team or a member picked in the Filters panel. `null` everywhere means company level. */
export interface DashboardSelection {
    scope: DashboardSelectionScope;
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
