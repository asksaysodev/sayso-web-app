import type { ReactNode } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import clsx from 'clsx';

export type ModalTone = 'danger' | 'primary' | 'success';

export interface ModalHeaderProps {
    icon?: ReactNode;
    tone?: ModalTone;
    title: ReactNode;
    description?: ReactNode;
    align?: 'center' | 'start';
    className?: string;
}

export function ModalHeader({ icon, tone = 'primary', title, description, align = 'center', className }: ModalHeaderProps) {
    return (
        <div className={clsx('ds-modal__header', align === 'start' && 'ds-modal__header--start', className)}>
            {icon && <span className={clsx('ds-modal__icon', `ds-modal__icon--${tone}`)}>{icon}</span>}
            <DialogPrimitive.Title className='ds-modal__title'>{title}</DialogPrimitive.Title>
            {description && (
                <DialogPrimitive.Description className='ds-modal__description'>{description}</DialogPrimitive.Description>
            )}
        </div>
    );
}
