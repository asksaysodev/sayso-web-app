import { useIsMutating } from '@tanstack/react-query';
import { Sheet, SheetHeader } from '@/components/ds/Sheet';
import { RETENTION_ACTION_KEY } from '@/views/Subscription/hooks/useRetentionAction';
import RetentionFlow from './RetentionFlow/RetentionFlow';
import type { ActiveSubscription } from './utils';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    subscription: ActiveSubscription;
}

export default function CancelSubscriptionSheet({ open, onOpenChange, subscription }: Props) {
    const isActionPending = useIsMutating({ mutationKey: RETENTION_ACTION_KEY }) > 0;

    // Closing while a change is in flight would hide whether it went through.
    const handleOpenChange = (nextOpen: boolean) => {
        if (nextOpen || !isActionPending) onOpenChange(nextOpen);
    };

    return (
        <Sheet open={open} onOpenChange={handleOpenChange}>
            <SheetHeader title={`${subscription.name} subscription`} />
            <RetentionFlow subscription={subscription} onClose={() => onOpenChange(false)} />
        </Sheet>
    );
}
