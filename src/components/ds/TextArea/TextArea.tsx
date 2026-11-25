import { forwardRef, useId, type ReactNode, type TextareaHTMLAttributes } from 'react';
import clsx from 'clsx';
import { FieldMessage, FieldShell } from '../FieldShell';
import './TextArea.css';

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: ReactNode;
    helperText?: ReactNode;
    error?: ReactNode;
}

/** Multi-line `TextField`: same frame and label, fixed height. */
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
    { label, helperText, error, disabled, id, className, ...props },
    ref,
) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const messageId = `${inputId}-message`;
    const hasMessage = !!(error || helperText);

    return (
        <div className={clsx('ds-field-group', className)}>
            <FieldShell label={label} htmlFor={inputId} disabled={disabled} invalid={!!error} className='ds-textarea'>
                <textarea
                    ref={ref}
                    id={inputId}
                    className='ds-field__input ds-textarea__input'
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
