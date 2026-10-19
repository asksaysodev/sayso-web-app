import type { ReactNode } from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

interface Props {
    label: string;
    enabled: boolean;
    children: ReactNode;
}

export default function SidebarTooltip({ label, enabled, children }: Props) {
    if (!enabled) return children;

    return (
        <TooltipPrimitive.Root>
            <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
            <TooltipPrimitive.Portal>
                <TooltipPrimitive.Content side='right' sideOffset={12} className='sidebar__tooltip'>
                    {label}
                </TooltipPrimitive.Content>
            </TooltipPrimitive.Portal>
        </TooltipPrimitive.Root>
    );
}
