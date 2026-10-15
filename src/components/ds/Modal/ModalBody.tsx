import type { HTMLAttributes } from 'react';
import clsx from 'clsx';

export function ModalBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return <div className={clsx('ds-modal__body', className)} {...props} />;
}
