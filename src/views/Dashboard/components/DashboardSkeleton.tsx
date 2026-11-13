import type { CSSProperties } from 'react';
import { ChartColumn, Phone, CalendarCheck, Target } from 'lucide-react';
import saysoLogo from '/assets/sayso.svg';
import AppShellSkeleton from '@/components/AppShellSkeleton/AppShellSkeleton';
import WidgetCard from './widget/WidgetCard';
import TipCardSkeleton from './Tips/TipCardSkeleton';
import ActivityChartSkeleton from './Activity/ActivityChartSkeleton';
import OverviewTile from './Overview/OverviewTile';
import OverviewTileSkeleton from './Overview/OverviewTileSkeleton';
import useTipsPerPage from '../hooks/useTipsPerPage';
import '../Dashboard.css';
import './Tips/Tips.css';
import './Activity/Activity.css';
import './Overview/Overview.css';
import './DashboardSkeleton.css';

const SKELETON_CARDS = ['tip-1', 'tip-2', 'tip-3'];

/**
 * Full-page dashboard placeholder for the sign-in → dashboard handoff. AuthGuard shows
 * it while the account / MFA checks run, and the `/` route uses it as the Suspense
 * fallback while the Dashboard chunk loads. Its widgets are the same cards and
 * skeletons the live widgets show while their data loads, so there's no visible
 * swap when it's replaced.
 */
export default function DashboardSkeleton() {
    const [skeletonRef, skeletonCount] = useTipsPerPage();

    return (
        <AppShellSkeleton>
            <main className='dashboard-page' aria-busy='true' aria-label='Loading dashboard'>
                <header className='dashboard-header'>
                    <div className='dashboard-header__text'>
                        <div className='dashboard-header__title-row'>
                            <h1 className='dashboard-header__title'>Dashboard</h1>
                        </div>
                        <p className='dashboard-header__last-update'>{' '}</p>
                    </div>
                </header>
                <div className='dashboard-grid'>
                    <WidgetCard
                        className='dashboard-grid__tips dashboard-tips'
                        icon={<img src={saysoLogo} width={16} height={16} alt='' />}
                        title='Coach Tips'
                    >
                        <div
                            ref={skeletonRef}
                            className='dashboard-tips__grid'
                            style={{ '--dashboard-tips-columns': skeletonCount } as CSSProperties}
                        >
                            {SKELETON_CARDS.slice(0, skeletonCount).map((id) => <TipCardSkeleton key={id} />)}
                        </div>
                    </WidgetCard>
                    <div className='dashboard-grid__widgets'>
                        <WidgetCard
                            className='dashboard-activity'
                            icon={<ChartColumn size={20} />}
                            tone='info'
                            title='Activity'
                            actions={<span className='skeleton dashboard-skeleton__action' />}
                        >
                            <ActivityChartSkeleton />
                        </WidgetCard>
                        <WidgetCard
                            className='dashboard-overview'
                            icon={<Target size={20} />}
                            tone='primary'
                            title='Overview'
                            actions={<span className='skeleton dashboard-skeleton__action' />}
                        >
                            <div className='dashboard-overview__tiles'>
                                <OverviewTile icon={<Phone size={20} />} label='Conversation time'>
                                    <OverviewTileSkeleton />
                                </OverviewTile>
                                <OverviewTile icon={<CalendarCheck size={20} />} label='Appointments booked'>
                                    <OverviewTileSkeleton />
                                </OverviewTile>
                            </div>
                        </WidgetCard>
                    </div>
                </div>
            </main>
        </AppShellSkeleton>
    );
}
