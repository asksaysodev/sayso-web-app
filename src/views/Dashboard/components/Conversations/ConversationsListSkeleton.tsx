export default function ConversationsListSkeleton() {
    return (
        <>
            {[...Array(4)].map((_, i) => (
                <div key={i} className="conv-skeleton-item">
                    <div className="conv-skeleton-time" />
                    <div className="conv-skeleton-main">
                        <div className="conv-skeleton-summary" />
                        <div className="conv-skeleton-meta" />
                    </div>
                </div>
            ))}
        </>
    );
}
