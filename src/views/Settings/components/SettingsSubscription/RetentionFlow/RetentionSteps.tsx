import { useState } from 'react';
import type {
    CancellationFeedback,
    PauseOption,
    PauseSubscriptionResponse,
    RetentionDiscount,
    RetentionOptions,
} from '@/views/Subscription/types';
import type { ActiveSubscription } from '../utils';
import CancelConfirmStep from './CancelConfirmStep';
import ChoiceStep from './ChoiceStep';
import DiscountConfirmed from './DiscountConfirmed';
import DiscountOfferStep from './DiscountOfferStep';
import PauseConfirmed from './PauseConfirmed';
import PauseDurationStep from './PauseDurationStep';
import ReasonStep from './ReasonStep';
import { type RetentionChoice, type RetentionStep, stepProgress } from './retentionPaths';

interface Props {
    subscription: ActiveSubscription;
    options: RetentionOptions;
    accessEndsAt: string;
    /** Refetches the options; resolves to the current offer, `null` if gone, `undefined` if the read failed. */
    onOfferChanged: () => Promise<RetentionDiscount | null | undefined>;
    onClose: () => void;
}

export default function RetentionSteps({ subscription, options, accessEndsAt, onOfferChanged, onClose }: Props) {
    const { pause, discount, reasons } = options;
    const [hasPause] = useState(!!pause);
    const [step, setStep] = useState<RetentionStep>(hasPause ? 'choice' : 'reason');
    const [choice, setChoice] = useState<RetentionChoice | null>(hasPause ? null : 'cancel');
    const [feedback, setFeedback] = useState<CancellationFeedback>({});
    const [paused, setPaused] = useState<{ option: PauseOption; result: PauseSubscriptionResponse } | null>(null);
    const [applied, setApplied] = useState<RetentionDiscount | null>(null);

    const progress = choice ? stepProgress(step, { choice, hasPause, hasDiscount: !!discount }) : null;
    const interval = subscription.interval ?? subscription.billing?.cycle;

    const handleReason = (nextFeedback: CancellationFeedback) => {
        setFeedback(nextFeedback);
        setStep(discount ? 'offer' : 'confirm');
    };

    const handleOfferChanged = async () => {
        if ((await onOfferChanged()) === null) setStep('confirm');
    };

    if (step === 'choice' && pause) {
        return (
            <ChoiceStep
                progress={progress}
                pauseOptions={pause.options}
                accessEndsAt={accessEndsAt}
                choice={choice}
                onChoiceChange={setChoice}
                onContinue={() => setStep(choice === 'pause' ? 'pause' : 'reason')}
                onClose={onClose}
            />
        );
    }

    if (step === 'pause' && pause) {
        return (
            <PauseDurationStep
                progress={progress}
                options={pause.options}
                interval={interval}
                onPaused={(option, result) => {
                    setPaused({ option, result });
                    setStep('pause-done');
                }}
                onClose={onClose}
            />
        );
    }

    if (step === 'pause-done' && paused) {
        return <PauseConfirmed months={paused.option.months} result={paused.result} onClose={onClose} />;
    }

    if (step === 'reason') {
        return <ReasonStep progress={progress} reasons={reasons} accessEndsAt={accessEndsAt} onContinue={handleReason} />;
    }

    if (step === 'offer' && discount) {
        return (
            <DiscountOfferStep
                progress={progress}
                subscription={subscription}
                interval={interval}
                discount={discount}
                feedback={feedback}
                onApplied={(offer) => {
                    setApplied(offer);
                    setStep('offer-done');
                }}
                onOfferChanged={handleOfferChanged}
                onContinueToCancel={() => setStep('confirm')}
            />
        );
    }

    if (step === 'offer-done' && applied) {
        return (
            <DiscountConfirmed
                planName={subscription.name}
                interval={interval}
                discount={applied}
                onClose={onClose}
            />
        );
    }

    return <CancelConfirmStep progress={progress} feedback={feedback} accessEndsAt={accessEndsAt} onClose={onClose} />;
}
