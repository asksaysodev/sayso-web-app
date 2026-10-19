import { X } from 'lucide-react';
import clsx from 'clsx';
import formatFileSize from '@/utils/formatters/formatFileSize';
import PlaybookFileTile from './PlaybookFileTile';
import '../styles/PlaybookFileChip.css';

interface Props {
    file: File;
    invalid: boolean;
    disabled: boolean;
    onRemove: () => void;
}

export default function PlaybookFileChip({ file, invalid, disabled, onRemove }: Props) {
    return (
        <div className={clsx('playbook-file-chip', invalid && 'playbook-file-chip--invalid')}>
            <PlaybookFileTile fileName={file.name} />
            <div className='playbook-file-chip__text'>
                <span className='playbook-file-chip__name' title={file.name}>{file.name}</span>
                <span className='playbook-file-chip__size'>{formatFileSize(file.size)}</span>
            </div>
            <button
                type='button'
                className='playbook-file-chip__remove'
                aria-label={`Remove ${file.name}`}
                disabled={disabled}
                onClick={onRemove}
            >
                <X size={18} />
            </button>
        </div>
    );
}
