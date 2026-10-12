import type { OverviewPeriod, OverviewPeriodOption } from '../types';

export const DEFAULT_OVERVIEW_PERIOD: OverviewPeriod = 'last_7_days';

export const OVERVIEW_PERIODS: OverviewPeriodOption[] = [
    { value: 'last_7_days', label: 'Last 7 days', comparison: 'previous 7 days' },
    { value: 'last_14_days', label: 'Last 14 days', comparison: 'previous 14 days' },
    { value: 'last_30_days', label: 'Last 30 days', comparison: 'previous 30 days' },
    { value: 'last_3_months', label: 'Last 3 months', comparison: 'previous 3 months' },
    { value: 'last_6_months', label: 'Last 6 months', comparison: 'previous 6 months' },
];
