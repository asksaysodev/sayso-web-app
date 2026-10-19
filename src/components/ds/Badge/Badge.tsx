import type { HTMLAttributes } from 'react';
import clsx from 'clsx';
import './Badge.css';

export type BadgeTone = 'neutral' | 'primary' | 'success' | 'warning' | 'error' | 'info';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    tone?: BadgeTone;
    /** Filled variant: dark tone background with light text (e.g. invoice status). */
    solid?: boolean;
}

export function Badge({ tone = 'neutral', solid = false, className, ...props }: BadgeProps) {
    return <span className={clsx('ds-badge', `ds-badge--${tone}`, solid && 'ds-badge--solid', className)} {...props} />;
}
