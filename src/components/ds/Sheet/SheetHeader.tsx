import type { ReactNode } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

export interface SheetHeaderProps {
    icon?: ReactNode;
    title: ReactNode;
}

export function SheetHeader({ icon, title }: SheetHeaderProps) {
    return (
        <div className='ds-sheet__header'>
            <div className='ds-sheet__heading'>
                {icon && <span className='ds-sheet__icon'>{icon}</span>}
                <DialogPrimitive.Title className='ds-sheet__title'>{title}</DialogPrimitive.Title>
            </div>
            <DialogPrimitive.Close className='ds-sheet__close' aria-label='Close'>
                <X size={16} />
            </DialogPrimitive.Close>
        </div>
    );
}
