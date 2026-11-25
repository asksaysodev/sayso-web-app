import { Button } from '@/components/ds/Button';
import useApplyRetentionDiscount from '@/views/Subscription/hooks/useApplyRetentionDiscount';
import type { CancellationFeedback, RetentionDiscount } from '@/views/Subscription/types';
import { getRetentionErrorCode } from '@/views/Subscription/utils/retentionError';
import useIsTeamAccount from '@/hooks/useIsTeamAccount';
import type { ActiveSubscription } from '../utils';
import DiscountOfferCard from './DiscountOfferCard';
import StepHeading, { type StepProgress } from './StepHeading';
import StepLayout from './StepLayout';
import StepLink from './StepLink';
import './DiscountOfferStep.css';

interface Props {
    progress: StepProgress | null;
    subscription: ActiveSubscription;
    interval: string | null;
    discount: RetentionDiscount;
    feedback: CancellationFeedback;
    onApplied: (discount: RetentionDiscount) => void;
    onOfferChanged: () => void;
    onContinueToCancel: () => void;
}

export default function DiscountOfferStep({
    progress,
    subscription,
    interval,
    discount,
    feedback,
    onApplied,
    onOfferChanged,
    onContinueToCancel,
}: Props) {
    const isTeam = useIsTeamAccount();
    const { run, isPending, errorMessage } = useApplyRetentionDiscount();
    const planMinutes = subscription.includedMinutes?.plan;
    const hours = planMinutes ? ` and all ${Math.floor(planMinutes / 60)} monthly hours` : '';

    const handleApply = () =>
        run(
            { discount, feedback },
            {
                onSuccess: onApplied,
                onError: (error) => {
                    if (getRetentionErrorCode(error) === 'offer_changed') onOfferChanged();
                },
            },
        );

    return (
        <StepLayout
            isCompact
            errorMessage={errorMessage}
            footer={
                <>
                    <StepLink onClick={onContinueToCancel} disabled={isPending}>
                        Continue to cancel
                    </StepLink>
                    <Button onClick={handleApply} loading={isPending}>
                        Apply discount & stay
                    </Button>
                </>
            }
        >
            <StepHeading
                progress={progress}
                title='Would a lower price help?'
                description={`Keep your ${subscription.name} plan${hours} at a reduced rate.`}
            />
            <DiscountOfferCard planName={subscription.name} interval={interval} discount={discount} />
            <p className='discount-offer-step__note'>
                {isTeam ? 'Your plan, hours and team access stay the same.' : 'Your plan, hours and access stay the same.'}
            </p>
        </StepLayout>
    );
}
