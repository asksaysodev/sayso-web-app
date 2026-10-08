import { forwardRef, type HTMLAttributes } from 'react';
import clsx from 'clsx';
import './Card.css';

export type CardProps = HTMLAttributes<HTMLDivElement>;

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card({ className, ...props }, ref) {
    return <div ref={ref} className={clsx('ds-card', className)} {...props} />;
});
