import type { ReactNode } from 'react';
import './Pagination.css';

export interface PaginationControlProps {
    label: string;
    icon: ReactNode;
    disabled: boolean;
    onClick: () => void;
}

export function PaginationControl({ label, icon, disabled, onClick }: PaginationControlProps) {
    return (
        <button type='button' className='ds-pagination__button' aria-label={label} disabled={disabled} onClick={onClick}>
            {icon}
        </button>
    );
}
