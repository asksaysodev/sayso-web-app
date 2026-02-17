export default function ActiveSubscriptionInformationSkeleton() {
    return (
        <div className="active-plan-information-container">
            <div className="subscription-section">
                <div className="subscription-section-content">
                    <div className="plan-header">
                        <div className="skeleton plan-icon-skeleton" />
                        <div className="plan-details">
                            <div className="skeleton plan-name-skeleton" />
                            <div className="skeleton plan-billing-period-skeleton" />
                            <div className="skeleton plan-renewal-text-skeleton" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="subscription-section">
                <h3 className="section-title">Invoices</h3>
                <div className="skeleton" style={{ width: '100%', height: '20px' }} />
            </div>

            <div className="subscription-section">
                <h3 className="section-title">Cancellation</h3>
                <div className="subscription-section-content">
                    <div className="skeleton cancel-plan-text-skeleton" />
                    <div className="skeleton cancel-button-skeleton" />
                </div>
            </div>
        </div>
    );
}

