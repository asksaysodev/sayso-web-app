import { useState } from 'react';
import { Button } from '@/components/ds/Button';
import ManageBillingButton from '../ManageBillingButton';
import StepLink from '../RetentionFlow/StepLink';
import { formatBill, intervalOf, planHours, renewalAfter, todayBill } from '../planState';
import { type ActiveSubscription, formatBillingDate, formatDollars, intervalLabel } from '../utils';
import ActionNotice from './ActionNotice';
import StateActionLayout from './StateActionLayout';
import type { Resume } from './useResume';

interface Props {
    subscription: ActiveSubscription;
    resume: Resume;
    onClose: () => void;
}

const PAYMENT_ERRORS = ['payment_failed', 'payment_action_required'];

export default function PaidResumeConfirm({ subscription, resume, onClose }: Props) {
    const [charge] = useState(() => todayBill(subscription));
    const { confirm, isPending, errorCode, errorMessage } = resume;
    const renewal = renewalAfter(subscription, charge.date);
    const hours = planHours(subscription);
    const billing = intervalLabel(intervalOf(subscription))?.toLowerCase();
    const isDiscounted = subscription.discount.active && charge.price === subscription.discount.discountedPrice;
    const fullPrice = ['the full', billing, 'price'].filter(Boolean).join(' ');
    const chargeLabel = isDiscounted && charge.price !== null ? formatDollars(charge.price) : fullPrice;
    const isPaymentError = !!errorCode && PAYMENT_ERRORS.includes(errorCode);

    const confirmLabel = () => {
        if (isPending) return 'Processing payment…';
        if (isPaymentError) return 'Try payment again';
        if (errorMessage && errorCode !== 'resume_changed') return 'Try again';
        return charge.price === null ? 'Pay and resume' : `Pay ${formatDollars(charge.price)} and resume`;
    };

    return (
        <StateActionLayout
            title='Resume your subscription now?'
            description={`A new ${billing ? `${billing} ` : ''}billing cycle starts right away. We’ll charge ${chargeLabel} today.`}
            rows={[
                { label: 'Charge today', value: formatBill(charge) },
                ...(hours ? [{ label: 'Hours refill', value: `${hours} · ${formatBillingDate(charge.date)}` }] : []),
                { label: 'Next renewal', value: formatBill(renewal) },
            ]}
            footer={
                <>
                    <StepLink onClick={onClose} disabled={isPending}>
                        Stay paused
                    </StepLink>
                    <Button onClick={confirm} loading={isPending}>
                        {confirmLabel()}
                    </Button>
                </>
            }
        >
            <ActionNotice
                errorMessage={
                    errorCode === 'payment_failed'
                        ? 'Your payment couldn’t be completed. Review your payment method in Manage billing, then try again.'
                        : errorMessage
                }
                isPending={isPending}
                pendingMessage='Confirming your payment and subscription. Please wait before trying again.'
                message={`Cue turns back on when payment is confirmed. Your new renewal date will be ${formatBillingDate(renewal.date)}.`}
            />
            {isPaymentError && !isPending && <ManageBillingButton />}
        </StateActionLayout>
    );
}
