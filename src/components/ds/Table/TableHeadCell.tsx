import type { ThHTMLAttributes } from 'react';
import { ChevronsUpDown } from 'lucide-react';
import clsx from 'clsx';
import type { SortDirection } from '@/types/sort';
import './Table.css';

export interface TableHeadCellProps extends ThHTMLAttributes<HTMLTableCellElement> {
    sortable?: boolean;
    /** Set on the column currently sorted; `undefined` on the others. */
    sortDirection?: SortDirection;
    onSort?: () => void;
}

const ARIA_SORT: Record<SortDirection, 'ascending' | 'descending'> = {
    asc: 'ascending',
    desc: 'descending',
};

export function TableHeadCell({ sortable, sortDirection, onSort, className, children, ...props }: TableHeadCellProps) {
    return (
        <th
            scope='col'
            aria-sort={sortDirection ? ARIA_SORT[sortDirection] : undefined}
            className={clsx('ds-table__head-cell', sortDirection && 'ds-table__head-cell--sorted', className)}
            {...props}
        >
            {sortable ? (
                <button type='button' className='ds-table__sort' onClick={onSort}>
                    {children}
                    <ChevronsUpDown size={16} aria-hidden='true' />
                </button>
            ) : (
                children
            )}
        </th>
    );
}
