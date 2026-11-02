import { useState } from 'react';
import useIsTeamAdmin from '@/hooks/useIsTeamAdmin';
import useHasSubscription from '@/hooks/useHasSubscription';
import DashboardHeader from './components/DashboardHeader';
import DashboardFilters from './components/Filters/DashboardFilters';
import CoachTipsWidget from './components/Tips/CoachTipsWidget';
import ActivityWidget from './components/Activity/ActivityWidget';
import OverviewWidget from './components/Overview/OverviewWidget';
import EmptyState from './components/EmptyState/EmptyState';
import './Dashboard.css';

export default function Dashboard() {
    const hasSubscription = useHasSubscription();

    // Early exit before any dashboard hook/widget: those call scoped endpoints a non-subscriber can't use.
    if (!hasSubscription) return <EmptyState />;

    return <DashboardContent />;
}

function DashboardContent() {
    const isAdmin = useIsTeamAdmin();
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    return (
        <main className='dashboard-page'>
            <DashboardHeader isAdmin={isAdmin} onOpenFilters={() => setIsFiltersOpen(true)} />
            {isAdmin && <DashboardFilters open={isFiltersOpen} onOpenChange={setIsFiltersOpen} />}
            <div className='dashboard-grid'>
                <CoachTipsWidget />
                <div className='dashboard-grid__widgets'>
                    <ActivityWidget />
                    <OverviewWidget />
                </div>
            </div>
        </main>
    );
}
