import { X } from 'lucide-react';
import clsx from 'clsx';
import './Chip.css';

export interface ChipProps {
    label: string;
    onRemove: () => void;
    className?: string;
}

export function Chip({ label, onRemove, className }: ChipProps) {
    return (
        <span className={clsx('ds-chip', className)}>
            <span className='ds-chip__label'>{label}</span>
            <button type='button' className='ds-chip__remove' onClick={onRemove} aria-label={`Remove ${label}`}>
                <X size={12} />
            </button>
        </span>
    );
}
