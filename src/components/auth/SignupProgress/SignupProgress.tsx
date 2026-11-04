import clsx from 'clsx';
import { Check } from 'lucide-react';
import './SignupProgress.css';

export type SignupStep = 'account' | 'plan' | 'download';

interface Props {
    current: SignupStep;
    hideSubscriptionStep?: boolean;
}

const STEPS: { id: SignupStep; label: string }[] = [
    { id: 'account', label: 'Account' },
    { id: 'plan', label: 'Subscription' },
    { id: 'download', label: 'Download' },
];

export default function SignupProgress({ current, hideSubscriptionStep = false }: Props) {
    const steps = hideSubscriptionStep ? STEPS.filter(step => step.id !== 'plan') : STEPS;
    const currentIndex = steps.findIndex(step => step.id === current);

    return (
        <ol className="signupProgress" aria-label="Sign-up progress">
            {steps.map((step, index) => {
                const status = index < currentIndex ? 'completed' : index === currentIndex ? 'active' : 'upcoming';
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
