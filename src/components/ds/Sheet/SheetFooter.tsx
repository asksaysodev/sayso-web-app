import type { HTMLAttributes } from 'react';
import clsx from 'clsx';

export function SheetFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return <div className={clsx('ds-sheet__footer', className)} {...props} />;
}
