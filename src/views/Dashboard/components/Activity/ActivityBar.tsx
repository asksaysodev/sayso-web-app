import type { DashboardDailyActivity } from '../../types';

interface Props {
    day: DashboardDailyActivity;
    maxMinutes: number;
}

export default function ActivityBar({ day, maxMinutes }: Props) {
    const minutes = day.activity?.minutes ?? 0;
    const heightPercent = maxMinutes > 0 ? (minutes / maxMinutes) * 100 : 0;

    return (
        <div className='dashboard-activity-chart__column'>
            <div className='dashboard-activity-chart__track'>
                {day.activity && (
                    <div className='dashboard-activity-chart__bar' style={{ height: `${heightPercent}%` }}>
                        <span className='dashboard-activity-chart__tooltip' role='tooltip'>
                            {minutes} min
                        </span>
                    </div>
                )}
            </div>
            <span className='dashboard-activity-chart__day' title={day.date.dayLong}>
                {day.date.dayShort}
            </span>
        </div>
    );
}
