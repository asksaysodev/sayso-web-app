import type { HTMLAttributes } from 'react';
import clsx from 'clsx';
import './Avatar.css';

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
    initials: string;
    /** Diameter in px. */
    size?: number;
}

export function Avatar({ initials, size = 40, className, style, ...props }: AvatarProps) {
    return (
        <span
            className={clsx('ds-avatar', className)}
            style={{ width: size, height: size, fontSize: Math.round(size * 0.4), ...style }}
            aria-hidden='true'
            {...props}
        >
            {initials}
        </span>
    );
}
