import { useState } from 'react';
import { Target } from 'lucide-react';
import WidgetCard from '../widget/WidgetCard';
import WidgetErrorState from '../widget/WidgetErrorState';
import PeriodSelect from './PeriodSelect';
import ConversationTimeTile from './ConversationTimeTile';
import AppointmentsTile from './AppointmentsTile';
import useDashboardOverview from '../../hooks/useDashboardOverview';
import { DEFAULT_OVERVIEW_PERIOD, OVERVIEW_PERIODS } from '../../constants/overviewPeriods';
import type { OverviewPeriod } from '../../types';
import './Overview.css';

export default function OverviewWidget() {
    const [period, setPeriod] = useState<OverviewPeriod>(DEFAULT_OVERVIEW_PERIOD);
    const { overview, isError, isRetrying, retry } = useDashboardOverview(period);
    const periodOption = OVERVIEW_PERIODS.find((option) => option.value === period) ?? OVERVIEW_PERIODS[0];

    return (
        <WidgetCard
            className='dashboard-overview'
            icon={<Target size={20} />}
            tone='primary'
            title='Overview'
            actions={<PeriodSelect value={periodOption} onChange={setPeriod} />}
        >
            {isError ? (
                <WidgetErrorState subject='overview' onRetry={retry} isRetrying={isRetrying} />
            ) : (
                <div className='dashboard-overview__tiles'>
                    <ConversationTimeTile overview={overview} />
                    <AppointmentsTile overview={overview} comparison={periodOption.comparison} />
                </div>
            )}
        </WidgetCard>
    );
}
