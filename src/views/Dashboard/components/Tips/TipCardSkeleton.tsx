export default function TipCardSkeleton({ width }: { width: number }) {
    return (
        <div className="tips-widget-card tips-widget-card-skeleton" style={{ flex: `0 0 ${width}px` }}>
            <div className="tips-skeleton-icon" />
            <div className="flex flex-col gap-2">
                <div className="tips-skeleton-title" />
                <div className="tips-skeleton-line" />
            </div>
        </div>
    );
}
