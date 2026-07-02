import { useState } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Dialog, DialogPortal, DialogOverlay } from '@/components/ui/dialog';
import SaysoButton from '@/components/SaysoButton';
import '../styles/SaysoDialog.css';

interface Props {
    triggerLabel: string;
    triggerIcon?: React.ReactNode;
    children: (props: { close: () => void }) => React.ReactNode;
}

export default function SaysoDialog({ triggerLabel, triggerIcon, children }: Props) {
    const [open, setOpen] = useState(false);
    const close = () => setOpen(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <SaysoButton label={triggerLabel} icon={triggerIcon} onClick={() => setOpen(true)} />
            <DialogPortal>
                <DialogOverlay />
                <DialogPrimitive.Content className="sayso-dialog">
                    {children({ close })}
                </DialogPrimitive.Content>
            </DialogPortal>
        </Dialog>
    );
}
