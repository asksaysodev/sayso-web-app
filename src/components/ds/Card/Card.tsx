import { forwardRef, type HTMLAttributes } from 'react';
import clsx from 'clsx';
import './Card.css';

export type CardProps = HTMLAttributes<HTMLDivElement>;

/**
 * The single surface for page-level containers: white, `--radius-16`, `--shadow-card`, no border.
 * Wrap any card-like block in this instead of hand-rolling radius/shadow; override only layout/padding.
 * Floating UI (menus, dropdowns) uses `--shadow-menu`; boxes nested inside a card use a 1px `--surface-border` + `--radius-8`.
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(function Card({ className, ...props }, ref) {
    return <div ref={ref} className={clsx('ds-card', className)} {...props} />;
});
