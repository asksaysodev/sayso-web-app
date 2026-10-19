import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import clsx from 'clsx';
import { DropdownMenuPortal } from '@/components/ui/dropdown-menu';
import './Menu.css';

export const MenuContent = forwardRef<
    ElementRef<typeof DropdownMenuPrimitive.Content>,
    ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(function MenuContent({ className, align = 'end', sideOffset = 4, ...props }, ref) {
    return (
        <DropdownMenuPortal>
            <DropdownMenuPrimitive.Content
                ref={ref}
                align={align}
                sideOffset={sideOffset}
                className={clsx('ds-menu', className)}
                {...props}
            />
        </DropdownMenuPortal>
    );
});
