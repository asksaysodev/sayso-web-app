import { useState } from 'react';
import useIsTeamAdmin from '@/hooks/useIsTeamAdmin';
import DashboardHeader from './components/DashboardHeader';
import DashboardFilters from './components/Filters/DashboardFilters';
import CoachTipsWidget from './components/Tips/CoachTipsWidget';
import ActivityWidget from './components/Activity/ActivityWidget';
import OverviewWidget from './components/Overview/OverviewWidget';
import './Dashboard.css';

export default function Dashboard() {
    const isAdmin = useIsTeamAdmin();
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    return (
        <main className='dashboard-page'>
            <DashboardHeader isAdmin={isAdmin} onOpenFilters={() => setIsFiltersOpen(true)} />
            {isAdmin && <DashboardFilters open={isFiltersOpen} onOpenChange={setIsFiltersOpen} />}
            <div className='dashboard-grid'>
                <CoachTipsWidget />
                <ActivityWidget />
                <OverviewWidget />
            </div>
        </main>
    );
}
