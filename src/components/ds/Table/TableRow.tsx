import type { HTMLAttributes } from 'react';
import clsx from 'clsx';
import './Table.css';

export type TableRowProps = HTMLAttributes<HTMLTableRowElement>;

export function TableRow({ className, ...props }: TableRowProps) {
    return <tr className={clsx('ds-table__row', className)} {...props} />;
}
