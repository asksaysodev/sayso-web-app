import type { TdHTMLAttributes } from 'react';
import clsx from 'clsx';
import './Table.css';

export type TableCellProps = TdHTMLAttributes<HTMLTableCellElement>;

export function TableCell({ className, ...props }: TableCellProps) {
    return <td className={clsx('ds-table__cell', className)} {...props} />;
}
