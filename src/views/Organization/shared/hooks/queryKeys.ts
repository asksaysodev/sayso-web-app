export const COMPANY_MEMBERS_QUERY_KEY = ['company-members'] as const;
export const TEAMS_QUERY_KEY = ['teams'] as const;
export const TEAM_DETAIL_QUERY_KEY = ['team'] as const;
export const teamDetailQueryKey = (teamId: string) => [...TEAM_DETAIL_QUERY_KEY, teamId] as const;
