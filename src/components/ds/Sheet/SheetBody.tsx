import type { HTMLAttributes } from 'react';
import clsx from 'clsx';

export function SheetBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return <div className={clsx('ds-sheet__body', className)} {...props} />;
}
