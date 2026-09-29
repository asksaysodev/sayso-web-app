import type { HTMLAttributes } from 'react';

export type TableBodyProps = HTMLAttributes<HTMLTableSectionElement>;

export function TableBody(props: TableBodyProps) {
    return <tbody {...props} />;
}
