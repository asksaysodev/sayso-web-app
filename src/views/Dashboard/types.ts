export type WeeklyActivityDirection = 'prev' | 'next';

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

/** Query params every `/dashboard/*` request carries. Empty for members. */
export interface DashboardRequestParams {
    scope?: 'company' | DashboardSelectionScope;
    scopeId?: string;
}

/** Background/icon color pair for a widget's icon tile or state circle. */
export type WidgetTone = 'primary' | 'info';
