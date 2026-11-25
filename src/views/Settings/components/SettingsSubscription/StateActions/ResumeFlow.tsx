import { useState } from 'react';
import type { ResumeSubscriptionResponse } from '@/views/Subscription/types';
import type { ActiveSubscription } from '../utils';
import { isPauseStarted } from '../planState';
import PaidResumeConfirm from './PaidResumeConfirm';
import PaidResumeDone from './PaidResumeDone';
import RemovePauseConfirm from './RemovePauseConfirm';
import RemovePauseDone from './RemovePauseDone';
import useResume from './useResume';

interface Props {
    subscription: ActiveSubscription;
    onClose: () => void;
}

export default function ResumeFlow({ subscription, onClose }: Props) {
    // The plan refetches behind the sheet; what the user confirmed must not change with it.
    const [snapshot] = useState(subscription);
    const [newCycle, setNewCycle] = useState(() => isPauseStarted(subscription));
    const [result, setResult] = useState<ResumeSubscriptionResponse | null>(null);
    const resume = useResume({
        subscription: snapshot,
        newCycle,
        onResumed: setResult,
        onCycleChanged: () => setNewCycle(!newCycle),
    });

    if (result?.newCycle) {
        return (
            <PaidResumeDone
                subscription={snapshot}
                renewsAt={result.renewsAt}
                isRefilled={subscription.billing.lastInvoicePaidAt !== snapshot.billing.lastInvoicePaidAt}
                onClose={onClose}
            />
        );
    }
    if (result) return <RemovePauseDone subscription={snapshot} renewsAt={result.renewsAt} onClose={onClose} />;

    const Confirm = newCycle ? PaidResumeConfirm : RemovePauseConfirm;
    return <Confirm subscription={snapshot} resume={resume} onClose={onClose} />;
}
