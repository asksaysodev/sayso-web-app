import clsx from 'clsx';
import { Check } from 'lucide-react';
import './SignupProgress.css';

export type SignupStep = 'account' | 'plan';

interface Props {
    current: SignupStep;
    hideSubscriptionStep?: boolean;
    /** `steps` = numbered rail (desktop); `bar` = thin segmented bar under the mobile top bar. */
    variant?: 'steps' | 'bar';
    /** Mounting right after the previous step: start from its look and animate forward
        (the finished step's circle fades and its check pops; the current one fades in). */
    animateFromPrevious?: boolean;
}

const STEPS: { id: SignupStep; label: string }[] = [
    { id: 'account', label: 'Account' },
    { id: 'plan', label: 'Subscription' },
];

const statusOf = (index: number, currentIndex: number) =>
    index < currentIndex ? 'completed' : index === currentIndex ? 'active' : 'upcoming';

export default function SignupProgress({
    current,
    hideSubscriptionStep = false,
    variant = 'steps',
    animateFromPrevious = false,
}: Props) {
    const steps = hideSubscriptionStep ? STEPS.filter(step => step.id !== 'plan') : STEPS;
    const currentIndex = steps.findIndex(step => step.id === current);
    // Invited sign-ups have no Subscription step, and a one-step rail says nothing.
    if (steps.length < 2) return null;

    if (variant === 'bar') {
        return (
            <ol
                className={clsx('signupProgressBar', animateFromPrevious && 'signupProgress--advance')}
                aria-label={`Sign-up progress: step ${currentIndex + 1} of ${steps.length}`}
            >
                {steps.map((step, index) => {
                    const status = statusOf(index, currentIndex);
                    return (
                        <li
                            key={step.id}
                            className={clsx('signupProgressBarSegment', `signupProgressBarSegment--${status}`)}
                            aria-current={status === 'active' ? 'step' : undefined}
                        >
                            <span className="signupProgressSrOnly">
                                {step.label}
                                {status === 'completed' && ' (completed)'}
                            </span>
                        </li>
                    );
                })}
            </ol>
        );
    }

    return (
        <ol className={clsx('signupProgress', animateFromPrevious && 'signupProgress--advance')} aria-label="Sign-up progress">
            {steps.map((step, index) => {
                const status = statusOf(index, currentIndex);
                return (
                    <li
                        key={step.id}
                        className={clsx('signupProgressItem', `signupProgressItem--${status}`)}
                        aria-current={status === 'active' ? 'step' : undefined}
                    >
                        <span className="signupProgressCircle" aria-hidden="true">
                            {status === 'completed' ? (
                                <Check size={20} color="var(--primary-800)" />
                            ) : (
                                index + 1
                            )}
                        </span>
                        <span className="signupProgressLabel">
                            {step.label}
                            {status === 'completed' && <span className="signupProgressSrOnly"> (completed)</span>}
                        </span>
                    </li>
                );
            })}
        </ol>
    );
}
