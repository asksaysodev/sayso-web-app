import { useEffect, useState, type ChangeEvent, type KeyboardEvent } from 'react';
import clsx from 'clsx';
import { Check, LoaderCircle, Pencil } from 'lucide-react';
import { TextField } from '@/components/ds/TextField';
import useCompany from '../hooks/useCompany';
import useRenameCompany from '../hooks/useRenameCompany';
import { COMPANY_NAME_MAX_LENGTH } from '../constants';
import './CompanyNameField.css';

const SAVED_ICON_MS = 2000;

export default function CompanyNameField() {
    const { company, isLoading } = useCompany();
    const { renameCompany, isPending, errorMessage, reset } = useRenameCompany();
    const [draft, setDraft] = useState<string | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [justSaved, setJustSaved] = useState(false);

    const savedName = company?.company_name ?? '';
    const value = draft ?? savedName;

    useEffect(() => {
        if (!justSaved) return;
        const timer = setTimeout(() => setJustSaved(false), SAVED_ICON_MS);
        return () => clearTimeout(timer);
    }, [justSaved]);

    const save = () => {
        if (isPending || draft === null) return;
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
        if (event.key === 'Enter') event.currentTarget.blur();
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
            maxLength={COMPANY_NAME_MAX_LENGTH}
            trailingIcon={trailingIcon}
            error={validationError ?? errorMessage ?? undefined}
        />
    );
}
