import { Fragment } from 'react';
import { Link, matchPath, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useNavItems from '@/components/Sidebar/useNavItems';
import { teamDetailQueryKey } from '@/views/Organization/shared/hooks/queryKeys';
import type { TeamDetail } from '@/views/Organization/Teams/types';

interface Crumb {
    label: string;
    to?: string;
}

const ORGANIZATION_PATH = '/organization';
const TEAM_DETAIL_PATH = '/organization/teams/:teamId';

const ORGANIZATION_TABS: Record<string, string> = {
    company: 'Company',
    teams: 'Teams',
};

export default function TopbarBreadcrumb() {
    const { pathname, search } = useLocation();
    const navItems = useNavItems();
    const current = navItems.find(({ to }) => (to === '/' ? pathname === '/' : pathname.startsWith(to)));

    const teamId = matchPath(TEAM_DETAIL_PATH, pathname)?.params.teamId ?? '';
    // Read-only subscription to the team detail cache; TeamDetail owns the fetch.
    const { data: teamDetail } = useQuery<TeamDetail>({
        queryKey: teamDetailQueryKey(teamId),
        enabled: false,
    });

    if (!current) return null;

    const crumbs: Crumb[] = [{ label: current.label }];

    if (teamId) {
        crumbs[0].to = ORGANIZATION_PATH;
        crumbs.push({ label: 'Teams', to: `${ORGANIZATION_PATH}?tab=teams` });
        if (teamDetail) crumbs.push({ label: teamDetail.team.name });
    } else if (pathname === ORGANIZATION_PATH) {
        const tab = new URLSearchParams(search).get('tab') ?? 'company';
        crumbs.push({ label: ORGANIZATION_TABS[tab] ?? ORGANIZATION_TABS.company });
    }

    return (
        <nav aria-label='Breadcrumb' className='topbar__breadcrumb'>
            {crumbs.map((crumb, index) => {
                const isLast = index === crumbs.length - 1;
                return (
                    <Fragment key={`${crumb.label}-${index}`}>
                        {index > 0 && (
                            <span className='topbar__breadcrumb-separator' aria-hidden>
                                /
                            </span>
                        )}
                        {isLast || !crumb.to ? (
                            <span aria-current={isLast ? 'page' : undefined}>{crumb.label}</span>
                        ) : (
                            <Link to={crumb.to} className='topbar__breadcrumb-link'>
                                {crumb.label}
                            </Link>
                        )}
                    </Fragment>
                );
            })}
        </nav>
    );
}
