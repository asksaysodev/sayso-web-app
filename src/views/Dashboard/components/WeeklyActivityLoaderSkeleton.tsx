export default function WeeklyActivityLoaderSkeleton() {
    return (
        <div className='activity-chart-container'>
            {[...Array(7)].map((_, index) => (
                <div key={index} className='activity-bar-wrapper'>
                    <div className='activity-bar-container'>
                        <div 
                            className='activity-bar-skeleton'
                            style={{ height: `${Math.random() * 60 + 20}%` }}
                        />
                    </div>
                    <div className='activity-day-label-skeleton' />
                </div>
            ))}
        </div>
    )
}