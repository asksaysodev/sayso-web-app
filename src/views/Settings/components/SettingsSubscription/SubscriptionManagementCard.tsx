import { Card } from '@/components/ds/Card';
import { Button } from '@/components/ds/Button';
import CancelSubscription from './CancelSubscription';
import ManageBillingButton from './ManageBillingButton';
import { billAfterReactivation, formatBillSentence, type PlanState } from './planState';
import { type ActiveSubscription, canStartCancellation } from './utils';

interface Props {
    subscription: ActiveSubscription;
    state: PlanState;
    onCancel: () => void;
    onReactivate: () => void;
}

export default function SubscriptionManagementCard({ subscription, state, onCancel, onReactivate }: Props) {
    const isCancelling = state === 'cancelling';
    const bill = isCancelling ? billAfterReactivation(subscription) : null;

    return (
        <Card className='subscription-card management-card'>
            <div className='management-card__text'>
                <div>
                    <h2 className='subscription-card__title'>Subscription management</h2>
                    <p className='management-card__description'>
                        {bill
                            ? `If you reactivate, your next bill will be ${formatBillSentence(bill)}. No charge today.`
                            : 'Update your payment method and billing information.'}
                    </p>
                </div>
                {canStartCancellation(subscription) && <CancelSubscription onClick={onCancel} />}
            </div>
            <div className='management-card__actions'>
                {isCancelling && <Button onClick={onReactivate}>Reactivate subscription</Button>}
                <ManageBillingButton isTinted={state !== 'normal'} />
            </div>
        </Card>
    );
}
