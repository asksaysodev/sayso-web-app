import { Card } from '@/components/ds/Card';
import { Button } from '@/components/ds/Button';
import useBillingPortal from '@/views/Subscription/hooks/useBillingPortal';
import CancelSubscription from './CancelSubscription';
import { type ActiveSubscription, canStartCancellation } from './utils';

interface Props {
    subscription: ActiveSubscription;
    onCancel: () => void;
}

export default function SubscriptionManagementCard({ subscription, onCancel }: Props) {
    const { openBillingPortal, isPendingBillingPortal } = useBillingPortal();

    return (
        <Card className='subscription-card management-card'>
            <div className='management-card__text'>
                <div>
                    <h2 className='subscription-card__title'>Subscription management</h2>
                    <p className='management-card__description'>Update your payment method and billing information.</p>
                </div>
                {canStartCancellation(subscription) && <CancelSubscription onClick={onCancel} />}
            </div>
            <Button onClick={openBillingPortal} loading={isPendingBillingPortal}>
                Manage billing
            </Button>
        </Card>
    );
}
