import applyRetentionDiscount from '../services/applyRetentionDiscount';
import type { CancellationFeedback, RetentionDiscount } from '../types';
import useRetentionAction from './useRetentionAction';

interface Variables {
    discount: RetentionDiscount;
    feedback: CancellationFeedback;
}

export default function useApplyRetentionDiscount() {
    return useRetentionAction({
        operation: 'applyRetentionDiscount',
        request: ({ discount, feedback }: Variables) =>
            applyRetentionDiscount({ offerKey: discount.offerKey, ...feedback }),
        isUpdated: (subscription) => subscription.discount.active,
        alreadyDone: { code: 'discount_active', toResult: ({ discount }) => discount },
    });
}
