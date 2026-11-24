import resumeSubscription from '../services/resumeSubscription';
import type { ResumeSubscriptionRequest } from '../types';
import useRetentionAction from './useRetentionAction';

/** `newCycle`: resuming charges today, so the plan is only up to date once that invoice is in. */
export default function useResumeSubscription({ newCycle, lastInvoicePaidAt }: { newCycle: boolean; lastInvoicePaidAt: string | null }) {
    return useRetentionAction({
        operation: 'resumeSubscription',
        request: (request: ResumeSubscriptionRequest) => resumeSubscription(request),
        isUpdated: (subscription) =>
            subscription.pause.state === 'none' &&
            (!newCycle || subscription.billing.lastInvoicePaidAt !== lastInvoicePaidAt),
        alreadyDone: {
            code: 'not_paused',
            toResult: ({ expectNewCycle }) => ({ resumed: true, newCycle: expectNewCycle, renewsAt: null }),
        },
    });
}
