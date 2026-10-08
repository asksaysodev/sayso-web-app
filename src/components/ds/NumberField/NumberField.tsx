import { useId, type ChangeEvent, type ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import clsx from 'clsx';
import { FieldMessage, FieldShell } from '../FieldShell';
import './NumberField.css';

export interface NumberFieldProps {
    label: ReactNode;
    value: number | null;
    onChange: (value: number | null) => void;
    min?: number;
    max?: number;
    step?: number;
    placeholder?: string;
    helperText?: ReactNode;
    error?: ReactNode;
    disabled?: boolean;
    className?: string;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

/**
 * Whole-number field with an up/down stepper (Figma "Set allocated hours"). A text input with
 * `inputMode='numeric'` rather than `type='number'`, so the browser's own spinner, wheel
 * scrolling and `e` / `-` input stay out of it.
 */
export function NumberField({
    label,
    value,
    onChange,
    min = 0,
    max = Number.MAX_SAFE_INTEGER,
    step = 1,
    placeholder,
    helperText,
    error,
    disabled,
    className,
}: NumberFieldProps) {
    const inputId = useId();
    const messageId = `${inputId}-message`;
    const hasMessage = Boolean(error || helperText);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const digits = event.target.value.replace(/\D/g, '');
        onChange(digits === '' ? null : clamp(Number(digits), min, max));
    };

    // From empty, either arrow lands on the minimum.
    const stepBy = (delta: number) => onChange(value === null ? min : clamp(value + delta, min, max));

    return (
        <div className={clsx('ds-field-group', className)}>
            <FieldShell
                label={label}
                htmlFor={inputId}
                trailingIcon={
                    <span className='ds-number__stepper'>
                        <button
                            type='button'
                            className='ds-number__step'
                            onClick={() => stepBy(step)}
                            disabled={disabled || (value !== null && value >= max)}
                            tabIndex={-1}
                            aria-label='Increase'
                        >
                            <ChevronUp size={16} />
                        </button>
                        <button
                            type='button'
                            className='ds-number__step'
                            onClick={() => stepBy(-step)}
                            disabled={disabled || value === null || value <= min}
                            tabIndex={-1}
                            aria-label='Decrease'
                        >
                            <ChevronDown size={16} />
                        </button>
                    </span>
                }
                disabled={disabled}
                invalid={Boolean(error)}
                className='ds-number'
            >
                <input
                    id={inputId}
                    type='text'
                    inputMode='numeric'
                    className='ds-field__input'
                    value={value ?? ''}
                    onChange={handleChange}
                    onKeyDown={(event) => {
                        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                            event.preventDefault();
                            stepBy(event.key === 'ArrowUp' ? step : -step);
                        }
                    }}
                    placeholder={placeholder}
                    disabled={disabled}
                    role='spinbutton'
                    aria-valuenow={value ?? undefined}
                    aria-valuemin={min}
                    aria-valuemax={max}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={hasMessage ? messageId : undefined}
                />
            </FieldShell>
            <FieldMessage id={messageId} error={error} helperText={helperText} />
        </div>
    );
}
