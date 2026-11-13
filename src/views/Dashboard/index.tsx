import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import useIsTeamAdmin from '@/hooks/useIsTeamAdmin';
import { writeSubscriptionHint } from './utils/subscriptionHint';
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
    const { user } = useAuth();

    // Lets the next sign-in's skeleton match this layout (widgets vs. empty state).
    useEffect(() => writeSubscriptionHint(user?.id, hasSubscription), [user?.id, hasSubscription]);

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
