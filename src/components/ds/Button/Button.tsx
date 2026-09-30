import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Slot } from '@radix-ui/react-slot';
import clsx from 'clsx';
import './Button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'ghost';
export type ButtonSize = 'md' | 'sm' | 'icon';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    leftIcon?: ReactNode;
    loading?: boolean;
    /** Renders the single child element instead of a `<button>` (e.g. a Radix trigger). `leftIcon` and `loading` are ignored. */
    asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
    { variant = 'primary', size = 'md', leftIcon, loading = false, asChild = false, className, disabled, type, children, ...props },
    ref,
) {
    const classes = clsx(
        'ds-button',
        `ds-button--${variant}`,
        `ds-button--${size}`,
        loading && 'ds-button--loading',
        className,
    );

    if (asChild) {
        return (
            <Slot ref={ref} className={classes} {...props}>
                {children}
            </Slot>
        );
    }

    return (
        <button
            ref={ref}
            type={type ?? 'button'}
            className={classes}
            disabled={disabled || loading}
            aria-busy={loading || undefined}
            {...props}
        >
            {loading ? <span className='ds-button__spinner' aria-hidden='true' /> : leftIcon}
            {children}
        </button>
    );
});
