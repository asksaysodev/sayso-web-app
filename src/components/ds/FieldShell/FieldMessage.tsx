import type { ReactNode } from 'react';
import clsx from 'clsx';
import './FieldShell.css';

export interface FieldMessageProps {
    id?: string;
    error?: ReactNode;
    helperText?: ReactNode;
}

/** Error (preferred) or helper text below a field. */
export function FieldMessage({ id, error, helperText }: FieldMessageProps) {
    if (!error && !helperText) return null;
    return (
        <p id={id} className={clsx('ds-field-message', error && 'ds-field-message--error')} role={error ? 'alert' : undefined}>
            {error || helperText}
        </p>
    );
}
