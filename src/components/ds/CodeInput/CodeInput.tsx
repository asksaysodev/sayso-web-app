import { forwardRef, useImperativeHandle, useRef, type ClipboardEvent, type KeyboardEvent } from 'react';
import clsx from 'clsx';
import './CodeInput.css';

export interface CodeInputProps {
    /** Digits entered so far (no gaps), e.g. "123". */
    value: string;
    onChange: (value: string) => void;
    length?: number;
    disabled?: boolean;
    invalid?: boolean;
    autoFocus?: boolean;
    'aria-label'?: string;
    className?: string;
}

export interface CodeInputHandle {
    focus: () => void;
}

const digitsOnly = (text: string) => text.replace(/\D/g, '');

/** One box per digit. Typing advances, Backspace goes back, pasting (or OTP autofill) fills every box. */
export const CodeInput = forwardRef<CodeInputHandle, CodeInputProps>(function CodeInput(
    { value, onChange, length = 6, disabled = false, invalid = false, autoFocus = false, 'aria-label': ariaLabel = 'Verification code', className },
    ref,
) {
    const inputs = useRef<(HTMLInputElement | null)[]>([]);
    const digits = Array.from({ length }, (_, index) => value[index] ?? '');

    const focusAt = (index: number) => {
        const target = inputs.current[Math.max(0, Math.min(index, length - 1))];
        target?.focus();
        target?.select();
    };

    useImperativeHandle(ref, () => ({ focus: () => focusAt(Math.min(value.length, length - 1)) }));

    // Writes `text` over the digits from `index` (never leaving gaps) and moves focus past the last one written.
    const fillFrom = (index: number, text: string) => {
        const incoming = digitsOnly(text);
        if (!incoming) return;
        const start = incoming.length >= length ? 0 : Math.min(index, value.length);
        const next = (value.slice(0, start) + incoming + value.slice(start + incoming.length)).slice(0, length);
        onChange(next);
        focusAt(start + incoming.length);
    };

    const handleKeyDown = (index: number) => (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Backspace') {
            event.preventDefault();
            if (digits[index]) {
                onChange(value.slice(0, index) + value.slice(index + 1));
                focusAt(index);
            } else if (index > 0) {
                onChange(value.slice(0, index - 1) + value.slice(index));
                focusAt(index - 1);
            }
        } else if (event.key === 'ArrowLeft') {
            event.preventDefault();
            focusAt(index - 1);
        } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            focusAt(index + 1);
        }
    };

    const handlePaste = (index: number) => (event: ClipboardEvent<HTMLInputElement>) => {
        event.preventDefault();
        fillFrom(index, event.clipboardData.getData('text'));
    };

    return (
        <div className={clsx('ds-code-input', invalid && 'ds-code-input--invalid', className)} role='group' aria-label={ariaLabel}>
            {digits.map((digit, index) => (
                <input
                    key={index}
                    ref={(element) => {
                        inputs.current[index] = element;
                    }}
                    className='ds-code-input__box'
                    type='text'
                    inputMode='numeric'
                    autoComplete={index === 0 ? 'one-time-code' : 'off'}
                    aria-label={`Digit ${index + 1}`}
                    aria-invalid={invalid || undefined}
                    value={digit}
                    disabled={disabled}
                    autoFocus={autoFocus && index === 0}
                    onFocus={(event) => event.target.select()}
                    onChange={(event) => fillFrom(index, event.target.value.replace(digit, '') || event.target.value)}
                    onKeyDown={handleKeyDown(index)}
                    onPaste={handlePaste(index)}
                />
            ))}
        </div>
    );
});
