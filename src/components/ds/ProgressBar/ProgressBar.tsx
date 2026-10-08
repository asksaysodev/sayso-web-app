import clsx from 'clsx';
import './ProgressBar.css';

export type ProgressBarTone = 'primary' | 'warning' | 'error';

export interface ProgressBarProps {
    /** Percent. Values outside 0–100 are clamped for the fill, e.g. a team over its cap fills the bar. */
    value: number;
    tone?: ProgressBarTone;
    'aria-label'?: string;
    className?: string;
}

export function ProgressBar({ value, tone = 'primary', 'aria-label': ariaLabel, className }: ProgressBarProps) {
    const clamped = Math.min(Math.max(value, 0), 100);

    return (
        <div
            role='progressbar'
            aria-label={ariaLabel}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={clamped}
            aria-valuetext={`${value}%`}
            className={clsx('ds-progress', `ds-progress--${tone}`, className)}
        >
            <div className='ds-progress__fill' style={{ width: `${clamped}%` }} />
        </div>
    );
}
