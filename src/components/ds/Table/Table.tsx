import { forwardRef, type TableHTMLAttributes } from 'react';
import clsx from 'clsx';
import './Table.css';

export type TableProps = TableHTMLAttributes<HTMLTableElement>;

export const Table = forwardRef<HTMLTableElement, TableProps>(function Table({ className, ...props }, ref) {
    return (
        <div className='ds-table-scroll'>
            <table ref={ref} className={clsx('ds-table', className)} {...props} />
        </div>
    );
});
