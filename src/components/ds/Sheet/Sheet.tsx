import type { ReactNode } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import clsx from 'clsx';
import { Dialog, DialogPortal } from '@/components/ui/dialog';
import './Sheet.css';

export interface SheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    className?: string;
    children: ReactNode;
}

/**
 * Full-height panel pinned to the right edge, over a blurred overlay. Must contain a `SheetHeader` so the dialog is labelled.
 */
export function Sheet({ open, onOpenChange, className, children }: SheetProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogPortal>
                <DialogPrimitive.Overlay className='ds-sheet-overlay' />
                <DialogPrimitive.Content className={clsx('ds-sheet', className)} aria-describedby={undefined}>
                    {children}
                </DialogPrimitive.Content>
            </DialogPortal>
        </Dialog>
    );
}
