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
    /** False renders a disabled field (ds disabled look) with no pencil. */
    editable?: boolean;
    onDirtyChange?: (dirty: boolean) => void;
}

/**
 * Text field that only becomes editable from its pencil button; clicks elsewhere on the field do nothing.
 * Saves only on Enter or the Save button; Escape reverts. Blurring with no changes locks it again,
 * blurring with changes keeps the draft and the Save button.
 * Trailing slot shows pencil → nothing while editing unchanged → Save (once edited) → spinner while saving → check once saved.
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
    label,
    ...props
}: InlineEditFieldProps) {
    const [draft, setDraft] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [justSaved, setJustSaved] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const formattedSaved = format(savedValue);
    const value = draft ?? formattedSaved;
    const isDirty = draft !== null && draft.trim() !== formattedSaved.trim();
    // Guards against Enter and the Save click both firing a save in the same tick.
    const savingRef = useRef(false);

    useEffect(() => {
        onDirtyChange?.(isDirty);
    }, [isDirty, onDirtyChange]);

    useEffect(() => {
        const input = inputRef.current;
        if (!input) return;
        if (isEditing) {
            input.focus();
            input.setSelectionRange(input.value.length, input.value.length);
        } else if (document.activeElement === input) {
            input.blur();
        }
    }, [isEditing]);

    useEffect(() => {
        if (!justSaved) return;
        const timer = setTimeout(() => setJustSaved(false), SAVED_ICON_MS);
        return () => clearTimeout(timer);
    }, [justSaved]);

    const save = async () => {
        if (savingRef.current) return;
        if (draft === null) {
            setIsEditing(false);
            return;
        }
        const next = draft.trim();
        if (next === formattedSaved.trim()) {
            setDraft(null);
            setIsEditing(false);
            return;
        }
        const validationError = validate?.(next) ?? null;
        if (validationError) {
            setError(validationError);
            return;
        }
        savingRef.current = true;
        setIsSaving(true);
        try {
            await onSave(next);
            setDraft(null);
            setIsEditing(false);
            setJustSaved(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save. Please try again.');
        } finally {
            savingRef.current = false;
            setIsSaving(false);
        }
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setDraft(format(event.target.value));
        setError(null);
        setJustSaved(false);
    };

    const handleBlur = () => {
        if (isDirty || isSaving) return;
        setDraft(null);
        setError(null);
        setIsEditing(false);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            void save();
        }
        if (event.key === 'Escape') {
            setDraft(null);
            setError(null);
            setIsEditing(false);
        }
    };

    const trailingIcon = !editable ? undefined : isSaving ? (
        <LoaderCircle size={20} className='ds-inline-edit__spinner' aria-label='Saving' />
    ) : isDirty ? (
        <button
            type='button'
            className='ds-inline-edit__save'
            // Keep focus in the input while the click saves.
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => void save()}
        >
            Save
        </button>
    ) : justSaved ? (
        <Check size={20} className='ds-inline-edit__saved' aria-label='Saved' />
    ) : isEditing ? undefined : (
        <button
            type='button'
            className='ds-inline-edit__edit'
            aria-label={typeof label === 'string' ? `Edit ${label}` : 'Edit'}
            onClick={() => setIsEditing(true)}
        >
            <Pencil size={20} aria-hidden />
        </button>
    );

    const isLocked = editable && !isEditing;

    return (
        <TextField
            {...props}
            ref={inputRef}
            label={label}
            className={clsx(
                'ds-inline-edit',
                value === '' && 'ds-inline-edit--empty',
                isLocked && 'ds-inline-edit--locked',
                className,
            )}
            value={value}
            onChange={handleChange}
            onBlur={editable ? handleBlur : undefined}
            onKeyDown={editable ? handleKeyDown : undefined}
            readOnly={isSaving || isLocked || readOnly}
            tabIndex={isLocked ? -1 : props.tabIndex}
            disabled={!editable || props.disabled}
            trailingIcon={trailingIcon}
            helperText={helperText}
            error={error ?? undefined}
        />
    );
}
