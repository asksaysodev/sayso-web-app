import type { ReactNode } from 'react';
import clsx from 'clsx';
import './Table.css';

export type TableState = 'loading' | 'empty' | 'error';

export interface TableStateRowProps {
    state: TableState;
    colSpan: number;
    children?: ReactNode;
    /** Rendered under the message, e.g. a retry button. */
    action?: ReactNode;
}

/** Full-width body row for loading / empty / error. */
export function TableStateRow({ state, colSpan, children, action }: TableStateRowProps) {
    return (
        <tr className='ds-table__state-row'>
            <td colSpan={colSpan} className={clsx('ds-table__state', `ds-table__state--${state}`)}>
                <div className='ds-table__state-content' role={state === 'error' ? 'alert' : 'status'}>
                    {state === 'loading' && <span className='ds-table__spinner' aria-hidden='true' />}
                    {children}
                    {action}
                </div>
            </td>
        </tr>
    );
}
