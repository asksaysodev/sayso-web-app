import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import clsx from 'clsx';
import './FieldShell.css';

export interface FieldShellProps extends HTMLAttributes<HTMLDivElement> {
    label?: ReactNode;
    /** Renders the label as a `<label htmlFor>` (native inputs). */
    htmlFor?: string;
    /** Renders the label as a `<span id>` (for `aria-labelledby` on non-native controls). */
    labelId?: string;
    leadingIcon?: ReactNode;
    trailingIcon?: ReactNode;
    disabled?: boolean;
    invalid?: boolean;
}

/**
 * Internal frame for ds fields (Figma "Text field"): border, label over value, optional icons.
 * Spreads extra props on the root so it can be a Radix `Trigger asChild` target.
 */
export const FieldShell = forwardRef<HTMLDivElement, FieldShellProps>(function FieldShell(
    { label, htmlFor, labelId, leadingIcon, trailingIcon, disabled, invalid, className, children, ...props },
    ref,
) {
    return (
        <div
            ref={ref}
            className={clsx(
                'ds-field',
                disabled && 'ds-field--disabled',
                invalid && 'ds-field--invalid',
                className,
            )}
            {...props}
        >
            {leadingIcon && <span className='ds-field__leading'>{leadingIcon}</span>}
            <div className='ds-field__main'>
                {label &&
                    (htmlFor ? (
                        <label className='ds-field__label' htmlFor={htmlFor}>
                            {label}
                        </label>
                    ) : (
                        <span className='ds-field__label' id={labelId}>
                            {label}
                        </span>
                    ))}
                {children}
            </div>
            {trailingIcon && <span className='ds-field__trailing'>{trailingIcon}</span>}
        </div>
    );
});
