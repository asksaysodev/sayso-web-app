import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import clsx from 'clsx';
import { Dialog, DialogPortal } from '@/components/ui/dialog';
import './Modal.css';

export interface ModalProps extends Pick<ComponentPropsWithoutRef<typeof DialogPrimitive.Content>, 'aria-describedby'> {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    hideClose?: boolean;
    className?: string;
    children: ReactNode;
}

/**
 * Overlay + centered container. Must contain a `ModalHeader` (or a Radix `Title`) so the dialog is labelled.
 * Pass `aria-describedby={undefined}` when the header has no description.
 */
export function Modal({ open, onOpenChange, hideClose = false, className, children, ...contentProps }: ModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogPortal>
                <DialogPrimitive.Overlay className='ds-modal-overlay' />
                <DialogPrimitive.Content className={clsx('ds-modal', className)} {...contentProps}>
                    {children}
                    {!hideClose && (
                        <DialogPrimitive.Close className='ds-modal__close' aria-label='Close'>
                            <X size={20} />
                        </DialogPrimitive.Close>
                    )}
                </DialogPrimitive.Content>
            </DialogPortal>
        </Dialog>
    );
}
