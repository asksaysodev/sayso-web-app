import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import clsx from 'clsx';
import { FieldMessage, FieldShell } from '../FieldShell';

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label: ReactNode;
    leadingIcon?: ReactNode;
    trailingIcon?: ReactNode;
    helperText?: ReactNode;
    error?: ReactNode;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
    { label, leadingIcon, trailingIcon, helperText, error, disabled, id, className, ...props },
    ref,
) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const messageId = `${inputId}-message`;
    const hasMessage = Boolean(error || helperText);

    return (
        <div className={clsx('ds-field-group', className)}>
            <FieldShell
                label={label}
                htmlFor={inputId}
                leadingIcon={leadingIcon}
                trailingIcon={trailingIcon}
                disabled={disabled}
                invalid={Boolean(error)}
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
