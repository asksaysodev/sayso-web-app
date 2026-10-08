import { useId, useRef, useState, type ClipboardEvent, type KeyboardEvent, type ReactNode } from 'react';
import { X } from 'lucide-react';
import clsx from 'clsx';
import { FieldMessage, FieldShell } from '../FieldShell';
import './ChipsInput.css';

const SEPARATOR_KEYS = ['Enter', ' ', ',', 'Tab'];
const PASTE_SPLIT = /[\s,;]+/;

export interface ChipsInputProps {
    label: ReactNode;
    chips: string[];
    onChange: (chips: string[]) => void;
    /** Returns an error message to reject a value, or `null` to accept it. Duplicates are rejected before this runs. */
    validate?: (value: string, chips: string[]) => string | null;
    /** Applied to each raw entry before validation (e.g. lowercase emails). Defaults to trim. */
    normalize?: (raw: string) => string;
    leadingIcon?: ReactNode;
    placeholder?: string;
    helperText?: ReactNode;
    /** External error (e.g. from submit); shown when there is no input error. */
    error?: ReactNode;
    disabled?: boolean;
    className?: string;
}

const trim = (raw: string) => raw.trim();

export function ChipsInput({
    label,
    chips,
    onChange,
    validate,
    normalize = trim,
    leadingIcon,
    placeholder,
    helperText,
    error,
    disabled,
    className,
}: ChipsInputProps) {
    const [inputValue, setInputValue] = useState('');
    const [inputError, setInputError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const inputId = useId();
    const messageId = `${inputId}-message`;
    const shownError = inputError ?? error;

    const check = (value: string, current: string[]) => {
        if (current.includes(value)) return 'Already added';
        return validate?.(value, current) ?? null;
    };

    const tryAdd = (raw: string) => {
        const value = normalize(raw);
        if (!value) return;

        const problem = check(value, chips);
        if (problem) {
            setInputError(problem);
            return;
        }

        onChange([...chips, value]);
        setInputValue('');
        setInputError(null);
    };

    const remove = (index: number) => {
        onChange(chips.filter((_, i) => i !== index));
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (SEPARATOR_KEYS.includes(event.key)) {
            if (event.key === 'Tab' && !inputValue.trim()) return;
            event.preventDefault();
            tryAdd(inputValue);
            return;
        }
        if (event.key === 'Backspace' && inputValue === '' && chips.length > 0) {
            remove(chips.length - 1);
            return;
        }
        setInputError(null);
    };

    const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
        const parts = event.clipboardData.getData('text').split(PASTE_SPLIT).map(normalize).filter(Boolean);
        if (parts.length <= 1) return;

        event.preventDefault();
        const next = [...chips];
        let firstError: string | null = null;

        for (const part of parts) {
            const problem = check(part, next);
            if (problem) {
                if (!firstError && problem !== 'Already added') firstError = `${part}: ${problem}`;
                continue;
            }
            next.push(part);
        }

        if (next.length > chips.length) {
            onChange(next);
            setInputValue('');
        }
        setInputError(firstError);
    };

    const handleBlur = () => {
        if (inputValue.trim()) tryAdd(inputValue);
    };

    return (
        <div className={clsx('ds-field-group', className)}>
            <FieldShell
                label={label}
                htmlFor={inputId}
                leadingIcon={leadingIcon}
                disabled={disabled}
                invalid={Boolean(shownError)}
                className='ds-chips'
                onClick={() => inputRef.current?.focus()}
            >
                <div className='ds-chips__list'>
                    {chips.map((chip, index) => (
                        <span key={chip} className='ds-chips__chip'>
                            {chip}
                            <button
                                type='button'
                                className='ds-chips__remove'
                                onClick={(event) => {
                                    event.stopPropagation();
                                    remove(index);
                                }}
                                disabled={disabled}
                                tabIndex={-1}
                                aria-label={`Remove ${chip}`}
                            >
                                <X size={14} />
                            </button>
                        </span>
                    ))}
                    <input
                        ref={inputRef}
                        id={inputId}
                        type='text'
                        className='ds-field__input ds-chips__input'
                        value={inputValue}
                        onChange={(event) => setInputValue(event.target.value)}
                        onKeyDown={handleKeyDown}
                        onPaste={handlePaste}
                        onBlur={handleBlur}
                        placeholder={chips.length === 0 ? placeholder : undefined}
                        disabled={disabled}
                        aria-invalid={shownError ? true : undefined}
                        aria-describedby={shownError || helperText ? messageId : undefined}
                    />
                </div>
            </FieldShell>
            <FieldMessage id={messageId} error={shownError} helperText={helperText} />
        </div>
    );
}
