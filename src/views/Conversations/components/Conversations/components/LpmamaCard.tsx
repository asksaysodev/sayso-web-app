import { useEffect, type ReactNode } from 'react';
import clsx from 'clsx';
import { Check, CircleAlert, LoaderCircle, Pencil } from 'lucide-react';
import { useInlineEdit } from '@/components/ds/InlineEditField';
import type { LpmamaField } from '../constants/lpmama';

interface Props {
    field: LpmamaField;
    value: string;
    canEdit: boolean;
    badge?: ReactNode;
    /** Persist the new value. Reject with an `Error` whose message is shown in the error state. */
    onSave: (value: string) => Promise<unknown>;
}

export default function LpmamaCard({ field, value: savedValue, canEdit, badge, onSave }: Props) {
    const { ref, value, error, isDirty, isEditing, isSaving, justSaved, save, startEditing, handleChange, handleBlur, handleKeyDown } =
        useInlineEdit<HTMLTextAreaElement>({ savedValue, onSave, multiline: true });

    // Grow with the content; the CSS max-height turns it into a scroll area.
    useEffect(() => {
        const textarea = ref.current;
        if (!textarea) return;
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
    }, [value, isEditing, ref]);

    const action = isSaving ? (
        <LoaderCircle size={16} className="conv-sc-spinner" aria-label="Saving" />
    ) : isDirty || error ? (
        <>
            {error && <CircleAlert size={12} className="conv-sc-error-icon" aria-hidden />}
            <button
                type="button"
                className="conv-sc-save"
                onMouseDown={e => e.preventDefault()}
                onClick={() => void save()}
            >
                Save
            </button>
        </>
    ) : justSaved ? (
        <Check size={16} className="conv-sc-saved" aria-label="Saved" />
    ) : canEdit && !isEditing ? (
        <button type="button" className="conv-sc-edit" aria-label={`Edit ${field.label}`} onClick={startEditing}>
            <Pencil size={16} aria-hidden />
        </button>
    ) : null;

    return (
        <div
            className={clsx(
                'conv-sc-card',
                !savedValue && !isEditing && 'conv-sc-card--empty',
                canEdit && 'conv-sc-card--editable',
                isEditing && 'conv-sc-card--editing',
                isSaving && 'conv-sc-card--saving',
                error && 'conv-sc-card--error',
            )}
        >
            <div className="conv-sc-head">
                <span className="conv-sc-badge">{field.letter}</span>
                <span className="conv-sc-label">{field.label}</span>
                {badge}
                {action}
            </div>
            {isEditing ? (
                <textarea
                    ref={ref}
                    className="conv-sc-textarea"
                    rows={1}
                    aria-label={field.label}
                    value={value}
                    readOnly={isSaving}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                />
            ) : (
                <div
                    className="conv-sc-val"
                    onClick={canEdit ? startEditing : undefined}
                >
                    {savedValue || 'Not captured'}
                </div>
            )}
            {error && <div className="conv-sc-error">{error}</div>}
        </div>
    );
}
