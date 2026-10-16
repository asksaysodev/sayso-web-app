import { Card } from '@/components/ds/Card';
import { Button } from '@/components/ds/Button';
import useStripeCancellation from '@/views/Subscription/hooks/useStripeCancellation';

interface Props {
    plan: string;
}

export default function SubscriptionManagementCard({ plan }: Props) {
    const { mutateGetStripeCancellationPageUrl, isPendingGetStripeCancellationPageUrl } = useStripeCancellation();
    const openBillingPortal = () => mutateGetStripeCancellationPageUrl(plan);

    return (
        <Card className='subscription-card management-card'>
            <div className='management-card__text'>
                <div>
                    <h2 className='subscription-card__title'>Subscription management</h2>
                    <p className='management-card__description'>Update your payment method and billing information.</p>
                </div>
                {/* Opens the billing portal until the pause/cancel retention flow ships. */}
                <button
                    type='button'
                    className='management-card__cancel'
                    onClick={openBillingPortal}
                    disabled={isPendingGetStripeCancellationPageUrl}
                >
                    I want to cancel
                </button>
            </div>
            <Button onClick={openBillingPortal} loading={isPendingGetStripeCancellationPageUrl}>
                Manage billing
            </Button>
        </Card>
    );
}
