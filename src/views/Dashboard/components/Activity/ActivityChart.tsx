import ActivityBar from './ActivityBar';
import type { DashboardActivity } from '../../types';

interface Props {
    activity: DashboardActivity;
}

export default function ActivityChart({ activity }: Props) {
    const maxMinutes = Math.max(0, ...activity.dailyActivity.map((day) => day.activity?.minutes ?? 0));
    const weekWord = activity.weekOffset === 0 ? 'this week' : 'that week';

    return (
        <div className='dashboard-activity-chart'>
            <div className='dashboard-activity-chart__columns'>
                {activity.dailyActivity.map((day) => (
                    <ActivityBar key={day.date.date} day={day} maxMinutes={maxMinutes} />
                ))}
            </div>
            <p className='dashboard-activity-chart__total'>
                {activity.totalMinutes} total minutes {weekWord}
            </p>
        </div>
    );
}
