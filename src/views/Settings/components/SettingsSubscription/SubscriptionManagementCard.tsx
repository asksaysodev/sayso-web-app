import { Card } from '@/components/ds/Card';
import { Button } from '@/components/ds/Button';
import useBillingPortal from '@/views/Subscription/hooks/useBillingPortal';

export default function SubscriptionManagementCard() {
    const { openBillingPortal, isPendingBillingPortal } = useBillingPortal();

    return (
        <Card className='subscription-card management-card'>
            <div className='management-card__text'>
                <div>
                    <h2 className='subscription-card__title'>Subscription management</h2>
                    <p className='management-card__description'>Update your payment method and billing information.</p>
                </div>
            </div>
            <Button onClick={openBillingPortal} loading={isPendingBillingPortal}>
                Manage billing
            </Button>
        </Card>
    );
}
