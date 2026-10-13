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
export type WidgetTone = 'primary' | 'info' | 'error';

/** The level a `/dashboard/*` response was resolved at. A member's own view comes back as `account`. */
export type DashboardResponseScope = 'company' | DashboardSelectionScope;

export type OverviewPeriod = 'last_7_days' | 'last_14_days' | 'last_30_days' | 'last_3_months' | 'last_6_months';

export interface OverviewPeriodOption {
    value: OverviewPeriod;
    label: string;
    /** Completes "vs. previous …" on the appointments delta badge. */
    comparison: string;
}

export interface DashboardOverview {
    scope: DashboardResponseScope;
    scopeId: string;
    period: OverviewPeriod;
    startDate: string;
    endDate: string;
    totalMinutes: number;
    appointmentsBooked: number;
    previousAppointmentsBooked: number;
    appointmentsDelta: number;
}

export interface DashboardDailyActivity {
    date: {
        date: string;
        dayLong: string;
        dayShort: string;
    };
    activity: {
        minutes: number;
        sessions: number;
        features: string[];
        bookedAppointments: number;
    } | null;
}

export interface DashboardActivity {
    scope: DashboardResponseScope;
    scopeId: string;
    weekOffset: number;
    startDate: string;
    endDate: string;
    hasPreviousWeek: boolean;
    hasNextWeek: boolean;
    totalMinutes: number;
    dailyActivity: DashboardDailyActivity[];
}

export interface CoachTipBlock {
    type: 'paragraph';
    text: string;
}

export interface CoachTip {
    title: string;
    body: CoachTipBlock[];
}

export interface DashboardTips {
    tips: CoachTip[];
    /** `false` when the scope got the default tips instead of generated ones. */
    custom: boolean;
    scope: DashboardResponseScope;
    scopeId: string;
}
