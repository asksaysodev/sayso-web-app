import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import clsx from 'clsx';
import { FieldMessage, FieldShell } from '../FieldShell';

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label: ReactNode;
    leadingIcon?: ReactNode;
    trailingIcon?: ReactNode;
    helperText?: ReactNode;
    error?: ReactNode;
    /** `outside` puts the label above the field box instead of over the value. */
    labelPlacement?: 'inside' | 'outside';
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
    { label, leadingIcon, trailingIcon, helperText, error, labelPlacement = 'inside', disabled, id, className, ...props },
    ref,
) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const messageId = `${inputId}-message`;
    const hasMessage = !!(error || helperText);
    const labelOutside = labelPlacement === 'outside';

    return (
        <div className={clsx('ds-field-group', className)}>
            {labelOutside && (
                <label className='ds-field-group__label' htmlFor={inputId}>
                    {label}
                </label>
            )}
            <FieldShell
                label={labelOutside ? undefined : label}
                htmlFor={inputId}
                leadingIcon={leadingIcon}
                trailingIcon={trailingIcon}
                disabled={disabled}
                invalid={!!error}
            >
                <input
                    ref={ref}
                    id={inputId}
                    className='ds-field__input'
                    disabled={disabled}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={hasMessage ? messageId : undefined}
                    {...props}
                />
            </FieldShell>
            <FieldMessage id={messageId} error={error} helperText={helperText} />
        </div>
    );
});
