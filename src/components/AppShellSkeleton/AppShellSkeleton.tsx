import type { ReactNode } from 'react';
import clsx from 'clsx';
import useSidebarCollapsed from '@/hooks/useSidebarCollapsed';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import logoHorizontal from '/assets/logo-pos-horizontal.png';
import logoMark from '/assets/sayso.svg';
import '../Layout.css';
import '../Sidebar/Sidebar.css';
import '../Topbar/Topbar.css';
import './AppShellSkeleton.css';

const NAV_ROWS = ['nav-1', 'nav-2', 'nav-3', 'nav-4'];
const FOOTER_ROWS = ['help', 'action-1', 'action-2'];

interface Props {
    children: ReactNode;
}

/**
 * Static stand-in for `Layout` (sidebar + topbar) while the session's account is
 * still loading. It reads no account data, so it's safe to render before
 * `globalUser` exists. It keeps the real sidebar width (collapsed state included)
 * so nothing jumps when the real shell replaces it.
 */
export default function AppShellSkeleton({ children }: Props) {
    const [collapsed] = useSidebarCollapsed();
    const isMobile = useMediaQuery('(max-width: 767px)');

    return (
        <div className='app-shell' aria-busy='true'>
            <aside className={clsx('sidebar', collapsed && 'sidebar--collapsed')} aria-hidden='true'>
                <div className='sidebar__content'>
                    <div>
                        <div className='sidebar__logo'>
                            {collapsed
                                ? <img src={logoMark} alt='' className='sidebar__logo-mark' />
                                : <img src={logoHorizontal} alt='' className='sidebar__logo-full' />}
                        </div>
                        <div className='sidebar__divider' />
                        <div className='sidebar__section'>
                            {NAV_ROWS.map((id) => <span key={id} className='skeleton app-shell-skeleton__row' />)}
                        </div>
                    </div>
                    <div>
                        <div className='sidebar__divider' />
                        <div className='sidebar__section'>
                            {FOOTER_ROWS.map((id) => <span key={id} className='skeleton app-shell-skeleton__row' />)}
                        </div>
                    </div>
                </div>
            </aside>
            <div className='app-shell__main'>
                <header className='topbar' aria-hidden='true'>
                    <div className='topbar__start'>
                        {isMobile
                            ? <>
                                <span className='skeleton app-shell-skeleton__menu' />
                                <img src={logoHorizontal} alt='' className='topbar__logo' />
                            </>
                            : <span className='skeleton app-shell-skeleton__breadcrumb' />}
                    </div>
                    <span className='skeleton app-shell-skeleton__avatar' />
                </header>
                <div className='app-shell__content'>{children}</div>
            </div>
        </div>
    );
}
