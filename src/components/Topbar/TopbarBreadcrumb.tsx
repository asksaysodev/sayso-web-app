import { Fragment } from 'react';
import { Link, matchPath, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useNavItems from '@/components/Sidebar/useNavItems';
import { teamDetailQueryKey } from '@/views/Organization/shared/hooks/queryKeys';
import type { TeamDetail } from '@/views/Organization/Teams/types';
import { DEFAULT_SETTINGS_PANEL, SETTINGS_PANEL_LABELS, type SettingsPanel } from '@/views/Settings/types';

interface Crumb {
    label: string;
    to?: string;
}

const COMPANY_PATH = '/company';
const SETTINGS_PATH = '/settings';
const TEAM_DETAIL_PATH = '/company/teams/:teamId';

const isSettingsPanel = (value: string | null): value is SettingsPanel =>
    value !== null && value in SETTINGS_PANEL_LABELS;

const COMPANY_TABS: Record<string, string> = {
    company: 'Members',
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

    if (pathname === SETTINGS_PATH) {
        const tab = new URLSearchParams(search).get('tab');
        const panel = isSettingsPanel(tab) ? tab : DEFAULT_SETTINGS_PANEL;
        return <Breadcrumb crumbs={[{ label: 'Settings', to: SETTINGS_PATH }, { label: SETTINGS_PANEL_LABELS[panel] }]} />;
    }

    if (!current) return null;

    const crumbs: Crumb[] = [{ label: current.label }];

    if (teamId) {
        crumbs[0].to = COMPANY_PATH;
        crumbs.push({ label: 'Teams', to: `${COMPANY_PATH}?tab=teams` });
        if (teamDetail) crumbs.push({ label: teamDetail.team.name });
    } else if (pathname === COMPANY_PATH) {
        const tab = new URLSearchParams(search).get('tab') ?? 'company';
        crumbs.push({ label: COMPANY_TABS[tab] ?? COMPANY_TABS.company });
    }

    return <Breadcrumb crumbs={crumbs} />;
}

function Breadcrumb({ crumbs }: { crumbs: Crumb[] }) {
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
