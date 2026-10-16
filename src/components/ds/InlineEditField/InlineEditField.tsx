import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react';
import clsx from 'clsx';
import { Check, LoaderCircle, Pencil } from 'lucide-react';
import { TextField, type TextFieldProps } from '../TextField';
import './InlineEditField.css';

const SAVED_ICON_MS = 2000;

export interface InlineEditFieldProps
    extends Omit<TextFieldProps, 'value' | 'defaultValue' | 'onChange' | 'onBlur' | 'onKeyDown' | 'trailingIcon' | 'error'> {
    /** The saved value. The field shows it until the user starts editing. */
    value: string;
    /** Persist the new value. Reject with an `Error` whose message is shown under the field. */
    onSave: (value: string) => Promise<unknown>;
    /** Return an error message to block the save, or null when valid. Runs on the trimmed value. */
    validate?: (value: string) => string | null;
    /** Display formatting, applied to the saved value and while typing (e.g. phone numbers). */
    format?: (value: string) => string;
    /** False renders a read-only field with no pencil. */
    editable?: boolean;
    onDirtyChange?: (dirty: boolean) => void;
}

/**
 * Text field that saves itself on blur or Enter; Escape reverts.
 * Trailing icon shows pencil → spinner while saving → check once saved.
 */
export function InlineEditField({
    value: savedValue,
    onSave,
    validate,
    format = (value) => value,
    editable = true,
    onDirtyChange,
    readOnly,
    className,
    helperText,
    ...props
}: InlineEditFieldProps) {
    const [draft, setDraft] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [justSaved, setJustSaved] = useState(false);
    // Set by Enter so a failed save is retried only on purpose, not on every blur.
    const retryRequested = useRef(false);

    const formattedSaved = format(savedValue);
    const value = draft ?? formattedSaved;

    useEffect(() => {
        onDirtyChange?.(draft !== null && draft !== formattedSaved);
    }, [draft, formattedSaved, onDirtyChange]);

    useEffect(() => {
        if (!justSaved) return;
        const timer = setTimeout(() => setJustSaved(false), SAVED_ICON_MS);
        return () => clearTimeout(timer);
    }, [justSaved]);

    const save = async () => {
        const retry = retryRequested.current;
        retryRequested.current = false;
        if (isSaving || draft === null) return;
        if (error && !retry) return;
        const next = draft.trim();
        if (next === formattedSaved.trim()) {
            setDraft(null);
            return;
        }
        const validationError = validate?.(next) ?? null;
        if (validationError) {
            setError(validationError);
            return;
        }
        setIsSaving(true);
        try {
            await onSave(next);
            setDraft(null);
            setJustSaved(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setDraft(format(event.target.value));
        setError(null);
        setJustSaved(false);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            retryRequested.current = true;
            event.currentTarget.blur();
        }
        if (event.key === 'Escape') {
            setDraft(null);
            setError(null);
        }
    };

    const trailingIcon = !editable ? undefined : isSaving ? (
        <LoaderCircle size={20} className='ds-inline-edit__spinner' aria-label='Saving' />
    ) : justSaved ? (
        <Check size={20} className='ds-inline-edit__saved' aria-label='Saved' />
    ) : (
        <Pencil size={20} aria-hidden />
    );

    return (
        <TextField
            {...props}
            className={clsx(
                'ds-inline-edit',
                !editable && 'ds-inline-edit--static',
                value === '' && 'ds-inline-edit--empty',
                className,
            )}
            value={value}
            onChange={handleChange}
            onBlur={editable ? save : undefined}
            onKeyDown={editable ? handleKeyDown : undefined}
            readOnly={!editable || isSaving || readOnly}
            trailingIcon={trailingIcon}
            helperText={helperText}
            error={error ?? undefined}
        />
    );
}
