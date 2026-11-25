import reactivateSubscription from '../services/reactivateSubscription';
import useRetentionAction from './useRetentionAction';

export default function useReactivateSubscription() {
    return useRetentionAction({
        operation: 'reactivateSubscription',
        request: () => reactivateSubscription(),
        isUpdated: (subscription) => !subscription.cancellation.pending && !subscription.cancelledAt,
        alreadyDone: { code: 'not_pending', toResult: () => ({ reactivated: true }) },
    });
}
