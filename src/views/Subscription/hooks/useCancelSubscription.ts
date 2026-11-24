import cancelSubscription from '../services/cancelSubscription';
import type { CancellationFeedback } from '../types';
import useRetentionAction from './useRetentionAction';

export default function useCancelSubscription() {
    return useRetentionAction({
        operation: 'cancelSubscription',
        request: (feedback: CancellationFeedback) => cancelSubscription(feedback),
        isUpdated: (subscription) => subscription.cancellation.pending,
    });
}
