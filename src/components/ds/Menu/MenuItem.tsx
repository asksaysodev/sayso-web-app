import { forwardRef, type ComponentPropsWithoutRef, type ElementRef, type ReactNode } from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import clsx from 'clsx';
import './Menu.css';

export interface MenuItemProps extends ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> {
    icon?: ReactNode;
    description?: ReactNode;
    tone?: 'default' | 'destructive';
}

export const MenuItem = forwardRef<ElementRef<typeof DropdownMenuPrimitive.Item>, MenuItemProps>(function MenuItem(
    { icon, description, tone = 'default', className, children, ...props },
    ref,
) {
    return (
        <DropdownMenuPrimitive.Item
            ref={ref}
            className={clsx('ds-menu__item', `ds-menu__item--${tone}`, className)}
            {...props}
        >
            {icon && <span className='ds-menu__icon'>{icon}</span>}
            <span className='ds-menu__text'>
                <span className='ds-menu__label'>{children}</span>
                {description && <span className='ds-menu__description'>{description}</span>}
            </span>
        </DropdownMenuPrimitive.Item>
    );
});
