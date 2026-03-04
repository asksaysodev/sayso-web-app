export default function SubscriptionPlansSkeleton() {
    return (
        <>
            <div className="select-your-plan-header">
                <div className="skeleton plans-skeleton-title" />
                <div className="skeleton plans-skeleton-description" />
            </div>

            <div className="plans-skeleton-tabs">
                <div className="skeleton plans-skeleton-tab" />
                <div className="skeleton plans-skeleton-tab" />
            </div>

            <div className="pricing-components-grid">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="pricing-card">
                        <div className="pricing-card-header">
                            <div className="skeleton plans-skeleton-plan-name" />
                            <div className="pricing-price-and-included-hours-container">
                                <div className="skeleton plans-skeleton-price" />
                                <div className="skeleton plans-skeleton-hours" />
                            </div>
                            <div className="skeleton plans-skeleton-cta" />
                        </div>
                        <div className="pricing-features-section">
                            <div className="skeleton plans-skeleton-features-title" />
                            {[1, 2, 3, 4].map((j) => (
                                <div key={j} className="pricing-feature-item">
                                    <div className="skeleton plans-skeleton-feature-icon" />
                                    <div className="skeleton plans-skeleton-feature-text" />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
