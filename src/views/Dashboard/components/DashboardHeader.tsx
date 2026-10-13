import { RefreshCw } from 'lucide-react';
import { useIsFetching } from '@tanstack/react-query';
import clsx from 'clsx';
import { Button } from '@/components/ds/Button';
import formatRelativeDateTime from '@/utils/formatters/formatRelativeDateTime';
import useDashboardLastUpdate from '../hooks/useDashboardLastUpdate';
import useRefreshDashboardData from '../hooks/useRefreshDashboardData';
import { DASHBOARD_QUERY_KEY } from '../queryKeys';
import FiltersButton from '@/components/ScopeFilters/FiltersButton';

interface Props {
    isAdmin: boolean;
    onOpenFilters: () => void;
}

export default function DashboardHeader({ isAdmin, onOpenFilters }: Props) {
    const { refreshDashboardData } = useRefreshDashboardData();
    const isFetching = useIsFetching({ queryKey: DASHBOARD_QUERY_KEY }) > 0;
    const lastUpdate = useDashboardLastUpdate();

    const lastUpdateText = lastUpdate !== null && (
        <p className='dashboard-header__last-update'>Last update: {formatRelativeDateTime(lastUpdate)}</p>
    );

    return (
        <header className={clsx('dashboard-header', isAdmin && 'dashboard-header--admin')}>
            <div className='dashboard-header__text'>
                <div className='dashboard-header__title-row'>
                    <h1 className='dashboard-header__title'>Dashboard</h1>
                    <Button
                        variant='ghost'
                        size='icon'
                        className='dashboard-header__refresh'
                        aria-label='Refresh dashboard'
                        disabled={isFetching}
                        onClick={refreshDashboardData}
                    >
                        <RefreshCw size={24} className={clsx(isFetching && 'dashboard-header__refresh-icon--spinning')} />
                    </Button>
                </div>
                {isAdmin && lastUpdateText}
            </div>
            {isAdmin ? <FiltersButton onClick={onOpenFilters} /> : lastUpdateText}
        </header>
    );
}
