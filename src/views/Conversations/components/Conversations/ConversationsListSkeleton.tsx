const SKELETON_ROWS = ['conversation-1', 'conversation-2', 'conversation-3', 'conversation-4'];

export default function ConversationsListSkeleton() {
    return (
        <>
            {SKELETON_ROWS.map((row) => (
                <div key={row} className="conv-skeleton-item">
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
