import type { HTMLAttributes } from 'react';
import clsx from 'clsx';
import './Table.css';

export type TableHeaderProps = HTMLAttributes<HTMLTableRowElement>;

/** `<thead>` with a single header row; children are `TableHeadCell`s. */
export function TableHeader({ className, ...props }: TableHeaderProps) {
    return (
        <thead>
            <tr className={clsx('ds-table__head-row', className)} {...props} />
        </thead>
    );
}
