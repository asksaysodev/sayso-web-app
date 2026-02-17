export default function InsightsListSkeleton() {
    return (
        <>
            {[...Array(3)].map((_, index) => (
                <div key={index} className='insight-group-skeleton'>
                    <div className='insight-group-skeleton-header'>
                        <div className='insight-group-skeleton-date' />
                        <div className='insight-group-skeleton-badge' />
                    </div>
                </div>
            ))}
        </>
    );
}
