import type { ReactNode } from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

interface Props {
    label: string;
    enabled: boolean;
    /** Keeps the tooltip wrapper mounted but never shows it (avoids remounting the trigger). */
    suppressed?: boolean;
    children: ReactNode;
}

export default function SidebarTooltip({ label, enabled, suppressed = false, children }: Props) {
    if (!enabled) return children;

    return (
        <TooltipPrimitive.Root open={suppressed ? false : undefined}>
            <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
            <TooltipPrimitive.Portal>
                <TooltipPrimitive.Content side='right' sideOffset={12} className='sidebar__tooltip'>
                    {label}
                </TooltipPrimitive.Content>
            </TooltipPrimitive.Portal>
        </TooltipPrimitive.Root>
    );
}
