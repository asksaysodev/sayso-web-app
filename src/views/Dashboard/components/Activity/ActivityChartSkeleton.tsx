const SKELETON_BARS = [
    { id: 'mon', height: 70 },
    { id: 'tue', height: 45 },
    { id: 'wed', height: 85 },
    { id: 'thu', height: 30 },
    { id: 'fri', height: 60 },
    { id: 'sat', height: 20 },
    { id: 'sun', height: 40 },
];

export default function ActivityChartSkeleton() {
    return (
        <div className='dashboard-activity-chart' aria-hidden='true'>
            <div className='dashboard-activity-chart__columns'>
                {SKELETON_BARS.map((bar) => (
                    <div key={bar.id} className='dashboard-activity-chart__column'>
                        <div className='dashboard-activity-chart__track'>
                            <div className='skeleton dashboard-activity-chart__bar-skeleton' style={{ height: `${bar.height}%` }} />
                        </div>
                        <span className='skeleton dashboard-activity-chart__day-skeleton' />
                    </div>
                ))}
            </div>
            <span className='skeleton dashboard-activity-chart__total-skeleton' />
        </div>
    );
}
