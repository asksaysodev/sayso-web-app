import clsx from 'clsx';
import { Check, LoaderCircle, Pencil } from 'lucide-react';
import { TextField, type TextFieldProps } from '../TextField';
import { useInlineEdit } from './useInlineEdit';
import './InlineEditField.css';

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
    const formattedSaved = format(savedValue);
    const {
        ref: inputRef,
        value,
        error,
        isDirty,
        isEditing,
        isSaving,
        justSaved,
        save,
        startEditing,
        handleChange,
        handleBlur,
        handleKeyDown,
    } = useInlineEdit<HTMLInputElement>({ savedValue: formattedSaved, onSave, validate, format, onDirtyChange });

    // Disabled (e.g. load failed) or read-only (e.g. still loading): no pencil, so it can't unlock the field.
    const canStartEditing = !props.disabled && !readOnly;

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
    ) : isEditing || !canStartEditing ? undefined : (
        <button
            type='button'
            className='ds-inline-edit__edit'
            aria-label={typeof label === 'string' ? `Edit ${label}` : 'Edit'}
            onClick={startEditing}
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
