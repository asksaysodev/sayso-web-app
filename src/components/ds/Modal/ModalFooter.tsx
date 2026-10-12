import type { HTMLAttributes } from 'react';
import clsx from 'clsx';

export function ModalFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return <div className={clsx('ds-modal__footer', className)} {...props} />;
}
