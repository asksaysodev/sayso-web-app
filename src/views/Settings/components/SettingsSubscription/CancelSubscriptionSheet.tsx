import { Sheet, SheetHeader } from '@/components/ds/Sheet';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    planName: string;
}

/** Shell of the retention side sheet; SAYSO-545 adds the pause/cancel steps. */
export default function CancelSubscriptionSheet({ open, onOpenChange, planName }: Props) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetHeader title={`${planName} subscription`} />
        </Sheet>
    );
}
