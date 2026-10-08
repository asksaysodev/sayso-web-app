import { useId, useState, type ChangeEvent, type DragEvent } from 'react';
import { Upload } from 'lucide-react';
import clsx from 'clsx';
import { FieldMessage } from '@/components/ds/FieldShell';
import { PLAYBOOK_FILE_ACCEPT } from '../utils/playbookFile';
import PlaybookFileChip from './PlaybookFileChip';
import '../styles/PlaybookFileField.css';

interface Props {
    file: File | null;
    error: string | null;
    disabled?: boolean;
    onChange: (file: File | null) => void;
}

/** Dropzone that becomes a file chip once a file is chosen. */
export default function PlaybookFileField({ file, error, disabled = false, onChange }: Props) {
    const inputId = useId();
    const messageId = `${inputId}-message`;
    const [isDragging, setIsDragging] = useState(false);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.files?.[0] ?? null);
        event.target.value = '';
    };

    const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        if (!disabled) setIsDragging(true);
    };

    const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        setIsDragging(false);
        if (disabled) return;
        const dropped = event.dataTransfer.files?.[0];
        if (dropped) onChange(dropped);
    };

    return (
        <div className='ds-field-group'>
            {file ? (
                <PlaybookFileChip file={file} invalid={!!error} disabled={disabled} onRemove={() => onChange(null)} />
            ) : (
                <label
                    htmlFor={inputId}
                    className={clsx('playbook-file-field', isDragging && 'playbook-file-field--dragging')}
                    onDragOver={handleDragOver}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                >
                    <span className='playbook-file-field__icon' aria-hidden='true'>
                        <Upload size={22} />
                    </span>
                    <span className='playbook-file-field__title'>
                        Drop a file here or <span className='playbook-file-field__browse'>browse</span>
                    </span>
                    <span className='playbook-file-field__hint'>PDF, DOCX or TXT · up to 20 MB</span>
                </label>
            )}
            <input
                id={inputId}
                type='file'
                aria-label='Playbook file'
                accept={PLAYBOOK_FILE_ACCEPT}
                className='playbook-file-field__input'
                disabled={disabled}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? messageId : undefined}
                onChange={handleInputChange}
            />
            <FieldMessage id={messageId} error={error} />
        </div>
    );
}
