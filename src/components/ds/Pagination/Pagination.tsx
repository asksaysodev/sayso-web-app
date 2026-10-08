import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import clsx from 'clsx';
import { getPageItems } from './getPageItems';
import { PaginationControl } from './PaginationControl';
import './Pagination.css';

export interface PaginationProps {
    page: number;
    pageCount: number;
    onPageChange: (page: number) => void;
    className?: string;
}

export function Pagination({ page, pageCount, onPageChange, className }: PaginationProps) {
    const isFirst = page <= 1;
    const isLast = page >= pageCount;

    return (
        <nav aria-label='Pagination' className={clsx('ds-pagination', className)}>
            <PaginationControl
                label='First page'
                icon={<ChevronsLeft size={16} />}
                disabled={isFirst}
                onClick={() => onPageChange(1)}
            />
            <PaginationControl
                label='Previous page'
                icon={<ChevronLeft size={16} />}
                disabled={isFirst}
                onClick={() => onPageChange(page - 1)}
            />
            {getPageItems(page, pageCount).map((item) =>
                typeof item === 'number' ? (
                    <button
                        key={item}
                        type='button'
                        className={clsx('ds-pagination__button', item === page && 'ds-pagination__button--current')}
                        aria-current={item === page ? 'page' : undefined}
                        aria-label={`Page ${item}`}
                        onClick={() => onPageChange(item)}
                    >
                        {item}
                    </button>
                ) : (
                    <span key={item} className='ds-pagination__ellipsis' aria-hidden='true'>
                        …
                    </span>
                ),
            )}
            <PaginationControl
                label='Next page'
                icon={<ChevronRight size={16} />}
                disabled={isLast}
                onClick={() => onPageChange(page + 1)}
            />
            <PaginationControl
                label='Last page'
                icon={<ChevronsRight size={16} />}
                disabled={isLast}
                onClick={() => onPageChange(pageCount)}
            />
        </nav>
    );
}
