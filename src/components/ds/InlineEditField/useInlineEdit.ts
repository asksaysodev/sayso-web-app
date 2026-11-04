import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react';

const SAVED_ICON_MS = 2000;

type EditableElement = HTMLInputElement | HTMLTextAreaElement;

export interface UseInlineEditOptions {
    /** The saved value, already formatted for display. */
    savedValue: string;
    /** Persist the new (trimmed) value. Reject with an `Error` whose message becomes `error`. */
    onSave: (value: string) => Promise<unknown>;
    /** Return an error message to block the save, or null when valid. Runs on the trimmed value. */
    validate?: (value: string) => string | null;
    /** Applied to the draft while typing (e.g. phone numbers). */
    format?: (value: string) => string;
    onDirtyChange?: (dirty: boolean) => void;
    /** Shift+Enter inserts a newline instead of saving. */
    multiline?: boolean;
}

/**
 * State machine shared by inline-edit surfaces: idle → editing → saving → saved (2s) → idle, with error.
 * Saves only on Enter or `save()`; Escape reverts; blurring with no changes locks it again,
 * blurring with changes keeps the draft.
 */
export function useInlineEdit<T extends EditableElement = HTMLInputElement>({
    savedValue,
    onSave,
    validate,
    format = (value) => value,
    onDirtyChange,
    multiline = false,
}: UseInlineEditOptions) {
    const [draft, setDraft] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [justSaved, setJustSaved] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const ref = useRef<T>(null);

    const value = draft ?? savedValue;
    const isDirty = draft !== null && draft.trim() !== savedValue.trim();
    // Guards against Enter and the Save click both firing a save in the same tick.
    const savingRef = useRef(false);

    useEffect(() => {
        onDirtyChange?.(isDirty);
    }, [isDirty, onDirtyChange]);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;
        if (isEditing) {
            element.focus();
            element.setSelectionRange(element.value.length, element.value.length);
        } else if (document.activeElement === element) {
            element.blur();
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
        if (next === savedValue.trim()) {
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

    const startEditing = () => setIsEditing(true);

    const handleChange = (event: ChangeEvent<T>) => {
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

    const handleKeyDown = (event: KeyboardEvent<T>) => {
        if (event.key === 'Enter' && !(multiline && event.shiftKey)) {
            event.preventDefault();
            void save();
        }
        if (event.key === 'Escape') {
            setDraft(null);
            setError(null);
            setIsEditing(false);
        }
    };

    return {
        ref,
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
    };
}
