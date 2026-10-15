import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react';
import clsx from 'clsx';
import { Check, LoaderCircle, Pencil } from 'lucide-react';
import { TextField } from '@/components/ds/TextField';
import useCompany from '../hooks/useCompany';
import useRenameCompany from '../hooks/useRenameCompany';
import { COMPANY_NAME_MAX_LENGTH } from '../constants';
import './CompanyNameField.css';

const SAVED_ICON_MS = 2000;

export default function CompanyNameField() {
    const { company, isLoading, isError } = useCompany();
    const { renameCompany, isPending, errorMessage, reset } = useRenameCompany();
    const [draft, setDraft] = useState<string | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [justSaved, setJustSaved] = useState(false);
    // Set by Enter so a failed save is retried only on purpose, not on every blur.
    const retryRequested = useRef(false);

    const savedName = company?.company_name ?? '';
    const value = draft ?? savedName;
    // Without the saved name the field would show blank, and saving would overwrite a name the user never saw.
    const loadFailed = company === null && isError;

    useEffect(() => {
        if (!justSaved) return;
        const timer = setTimeout(() => setJustSaved(false), SAVED_ICON_MS);
        return () => clearTimeout(timer);
    }, [justSaved]);

    const save = () => {
        const retry = retryRequested.current;
        retryRequested.current = false;
        if (isPending || draft === null) return;
        if (errorMessage && !retry) return;
        const name = draft.trim();
        if (name === savedName) {
            setDraft(null);
            return;
        }
        if (name === '') {
            setValidationError('Organization name is required');
            return;
        }
        if (name.length > COMPANY_NAME_MAX_LENGTH) {
            setValidationError(`Organization name must be ${COMPANY_NAME_MAX_LENGTH} characters or fewer`);
            return;
        }
        renameCompany(name, {
            onSuccess: () => {
                setDraft(null);
                setJustSaved(true);
            },
        });
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setDraft(event.target.value);
        setValidationError(null);
        setJustSaved(false);
        reset();
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            retryRequested.current = true;
            event.currentTarget.blur();
        }
        if (event.key === 'Escape') {
            setDraft(null);
            setValidationError(null);
            reset();
        }
    };

    const trailingIcon = isPending ? (
        <LoaderCircle size={20} className='company-name-field__spinner' aria-label='Saving' />
    ) : justSaved ? (
        <Check size={20} className='company-name-field__saved' aria-label='Saved' />
    ) : (
        <Pencil size={20} aria-hidden />
    );

    return (
        <TextField
            className={clsx('company-name-field', value === '' && 'company-name-field--empty')}
            label='Organization name'
            value={value}
            onChange={handleChange}
            onBlur={save}
            onKeyDown={handleKeyDown}
            readOnly={isPending || isLoading}
            disabled={loadFailed}
            helperText={loadFailed ? "Couldn't load the organization name. Refresh to try again." : undefined}
            maxLength={COMPANY_NAME_MAX_LENGTH}
            trailingIcon={trailingIcon}
            error={validationError ?? errorMessage ?? undefined}
        />
    );
}
