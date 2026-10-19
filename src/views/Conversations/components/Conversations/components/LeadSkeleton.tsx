const SKELETON_ROWS = ['lead-1', 'lead-2', 'lead-3', 'lead-4'];

export default function LeadSkeleton() {
    return (
        <>
            {SKELETON_ROWS.map((row) => (
                <div key={row} className="add-lead-skeleton-row">
                    <div className="add-lead-skeleton-name" />
                    <div className="add-lead-skeleton-sub" />
                </div>
            ))}
        </>
    );
}
