import { forwardRef, type ComponentPropsWithoutRef, type ElementRef, type HTMLAttributes, type ReactNode } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import clsx from 'clsx';
import { Dialog, DialogPortal } from '@/components/ui/dialog';
import './Modal.css';

export type ModalTone = 'danger' | 'primary' | 'success';

export const Modal = Dialog;

export interface ModalContentProps extends ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
    hideClose?: boolean;
}

/**
 * Overlay + centered container. Must contain a `ModalHeader` (or a Radix `Title`) so the dialog is labelled.
 */
export const ModalContent = forwardRef<ElementRef<typeof DialogPrimitive.Content>, ModalContentProps>(
    function ModalContent({ className, children, hideClose = false, ...props }, ref) {
        return (
            <DialogPortal>
                <DialogPrimitive.Overlay className='ds-modal-overlay' />
                <DialogPrimitive.Content ref={ref} className={clsx('ds-modal', className)} {...props}>
                    {children}
                    {!hideClose && (
                        <DialogPrimitive.Close className='ds-modal__close' aria-label='Close'>
                            <X size={20} />
                        </DialogPrimitive.Close>
                    )}
                </DialogPrimitive.Content>
            </DialogPortal>
        );
    },
);

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

export function ModalBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return <div className={clsx('ds-modal__body', className)} {...props} />;
}

export function ModalFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return <div className={clsx('ds-modal__footer', className)} {...props} />;
}

export const ModalClose = DialogPrimitive.Close;
