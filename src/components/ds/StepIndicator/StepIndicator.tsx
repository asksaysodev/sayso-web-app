import { Fragment } from 'react';
import clsx from 'clsx';
import './StepIndicator.css';

export interface StepIndicatorProps {
    /** Total steps. */
    count: number;
    /** 1-based current step. */
    current: number;
    className?: string;
}

/** Numbered circles joined by lines; steps up to `current` are filled. */
export function StepIndicator({ count, current, className }: StepIndicatorProps) {
    return (
        <ol className={clsx('ds-steps', className)} aria-label={`Step ${current} of ${count}`}>
            {Array.from({ length: count }, (_, index) => {
                const step = index + 1;
                const isReached = step <= current;
                return (
                    <Fragment key={step}>
                        {index > 0 && (
                            <li aria-hidden className={clsx('ds-steps__line', isReached && 'ds-steps__line--reached')} />
                        )}
                        <li
                            className={clsx('ds-steps__step', isReached && 'ds-steps__step--reached')}
                            aria-current={step === current ? 'step' : undefined}
                        >
                            {step}
                        </li>
                    </Fragment>
                );
            })}
        </ol>
    );
}
