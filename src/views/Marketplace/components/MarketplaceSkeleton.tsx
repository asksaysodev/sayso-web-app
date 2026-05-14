export default function MarketplaceSkeleton() {
    return (
        <div className="marketplace-grid">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="marketplace-card">
                    <div className="skeleton marketplace-skeleton-subtitle" />
                    <div className="skeleton marketplace-skeleton-title" />
                    <div className="skeleton marketplace-skeleton-line" />
                    <div className="skeleton marketplace-skeleton-line" />
                    <div className="skeleton marketplace-skeleton-line marketplace-skeleton-line-short" />
                    <div className="skeleton marketplace-skeleton-pill" />
                </div>
            ))}
        </div>
    );
}
