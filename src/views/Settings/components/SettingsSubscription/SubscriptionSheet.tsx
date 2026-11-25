import { useIsMutating } from '@tanstack/react-query';
import { Sheet, SheetHeader } from '@/components/ds/Sheet';
import { RETENTION_ACTION_KEY } from '@/views/Subscription/hooks/useRetentionAction';
import RetentionFlow from './RetentionFlow/RetentionFlow';
import ReactivateFlow from './StateActions/ReactivateFlow';
import ResumeFlow from './StateActions/ResumeFlow';
import type { ActiveSubscription } from './utils';

export type SubscriptionFlow = 'cancel' | 'reactivate' | 'resume';

interface Props {
    flow: SubscriptionFlow;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    subscription: ActiveSubscription;
}

const FLOWS = { cancel: RetentionFlow, reactivate: ReactivateFlow, resume: ResumeFlow };

export default function SubscriptionSheet({ flow, open, onOpenChange, subscription }: Props) {
    const isActionPending = useIsMutating({ mutationKey: RETENTION_ACTION_KEY }) > 0;
    const Flow = FLOWS[flow];

    // Closing while a change is in flight would hide whether it went through.
    const handleOpenChange = (nextOpen: boolean) => {
        if (nextOpen || !isActionPending) onOpenChange(nextOpen);
    };

    return (
        <Sheet open={open} onOpenChange={handleOpenChange}>
            <SheetHeader title={flow === 'cancel' ? `${subscription.name} subscription` : 'Subscription'} />
            <Flow subscription={subscription} onClose={() => onOpenChange(false)} />
        </Sheet>
    );
}
