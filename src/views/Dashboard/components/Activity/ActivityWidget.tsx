import { useState } from 'react';
import { ChartColumn } from 'lucide-react';
import WidgetCard from '../widget/WidgetCard';
import WidgetErrorState from '../widget/WidgetErrorState';
import WidgetState from '../widget/WidgetState';
import WeekSelector from './WeekSelector';
import ActivityChart from './ActivityChart';
import ActivityChartSkeleton from './ActivityChartSkeleton';
import useDashboardActivity from '../../hooks/useDashboardActivity';
import './Activity.css';

export default function ActivityWidget() {
    const [weekOffset, setWeekOffset] = useState(0);
    const { activity, isError, retry } = useDashboardActivity(weekOffset);

    const renderBody = () => {
        if (isError) return <WidgetErrorState subject='activity' onRetry={retry} />;
        if (!activity) return <ActivityChartSkeleton />;
        if (activity.totalMinutes === 0) {
            return (
                <WidgetState
                    icon={<ChartColumn size={32} />}
                    title='No activity this week'
                    text='Try another week to view your activity.'
                />
            );
        }
        return <ActivityChart activity={activity} />;
    };

    return (
        <WidgetCard
            className='dashboard-activity'
            icon={<ChartColumn size={20} />}
            tone='info'
            title='Activity'
            actions={
                <WeekSelector
                    activity={activity}
                    onPrevious={() => setWeekOffset((offset) => offset + 1)}
                    onNext={() => setWeekOffset((offset) => Math.max(0, offset - 1))}
                />
            }
        >
            {renderBody()}
        </WidgetCard>
    );
}
