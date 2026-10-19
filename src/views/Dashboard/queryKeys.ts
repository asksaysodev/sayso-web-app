export const DASHBOARD_QUERY_KEY = ['dashboard'] as const;
export const dashboardQueryKeys = {
    overview: (scopeKey: string, period: string) => [...DASHBOARD_QUERY_KEY, 'overview', scopeKey, period] as const,
    activity: (scopeKey: string, weekOffset: number) => [...DASHBOARD_QUERY_KEY, 'activity', scopeKey, weekOffset] as const,
    tips: (scopeKey: string) => [...DASHBOARD_QUERY_KEY, 'tips', scopeKey] as const,
};
