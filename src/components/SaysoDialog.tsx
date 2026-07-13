import { useState } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Dialog, DialogTrigger, DialogPortal, DialogOverlay } from '@/components/ui/dialog';
import SaysoButton from '@/components/SaysoButton';
import '../styles/SaysoDialog.css';

interface Props {
    triggerLabel: string;
    triggerIcon?: React.ReactNode;
    children: (props: { close: () => void }) => React.ReactNode;
}

/**
 * Dialog shell with a SaysoButton trigger. Content is passed as a render prop so
 * it can close the dialog itself.
 *
 * Content must render a DialogTitle (and ideally a DialogDescription) — Radix
 * uses them to label the dialog for screen readers and warns in dev if the title
 * is missing.
 */
export default function SaysoDialog({ triggerLabel, triggerIcon, children }: Props) {
    const [open, setOpen] = useState(false);
    const close = () => setOpen(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <SaysoButton label={triggerLabel} icon={triggerIcon} />
            </DialogTrigger>
            <DialogPortal>
                <DialogOverlay />
                <DialogPrimitive.Content className="sayso-dialog">
                    {children({ close })}
                </DialogPrimitive.Content>
            </DialogPortal>
        </Dialog>
    );
}
