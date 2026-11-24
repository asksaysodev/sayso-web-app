import useResumeSubscription from '@/views/Subscription/hooks/useResumeSubscription';
import type { ResumeSubscriptionResponse } from '@/views/Subscription/types';
import { getRetentionErrorCode } from '@/views/Subscription/utils/retentionError';
import type { ActiveSubscription } from '../utils';

interface Options {
    subscription: ActiveSubscription;
    newCycle: boolean;
    onResumed: (result: ResumeSubscriptionResponse) => void;
    /** The pause started (or not) since the sheet opened: the terms shown no longer apply. */
    onCycleChanged: () => void;
}

export interface Resume {
    confirm: () => void;
    isPending: boolean;
    errorCode?: string;
    errorMessage: string | null;
}

export default function useResume({ subscription, newCycle, onResumed, onCycleChanged }: Options): Resume {
    const { run, isPending, errorCode, errorMessage } = useResumeSubscription({
        newCycle,
        lastInvoicePaidAt: subscription.billing.lastInvoicePaidAt,
    });

    const confirm = () =>
        run(
            { expectNewCycle: newCycle },
            {
                onSuccess: onResumed,
                onError: (error) => {
                    if (getRetentionErrorCode(error) === 'resume_changed') onCycleChanged();
                },
            },
        );

    return { confirm, isPending, errorCode, errorMessage };
}
