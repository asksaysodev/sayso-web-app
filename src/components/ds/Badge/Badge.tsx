import type { HTMLAttributes } from 'react';
import clsx from 'clsx';
import './Badge.css';

export type BadgeTone = 'neutral' | 'primary' | 'success' | 'warning' | 'error' | 'info';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    tone?: BadgeTone;
}

export function Badge({ tone = 'neutral', className, ...props }: BadgeProps) {
    return <span className={clsx('ds-badge', `ds-badge--${tone}`, className)} {...props} />;
}
