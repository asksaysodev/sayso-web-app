import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { GetAccountSubscriptionResponse } from '../types';

const POLL_INTERVAL_MS = 2_000;
const POLL_ATTEMPTS = 8;

type ActiveSubscription = GetAccountSubscriptionResponse['subscription'];

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Refetches the plan until `isUpdated`: Stripe webhooks write some changes a few seconds after the
 * request succeeds, so the first refetch can still return the old state. Resolves to whether it was.
 */
export default function useRefreshActivePlan() {
    const queryClient = useQueryClient();

    return useCallback(
        async (isUpdated: (subscription: ActiveSubscription) => boolean) => {
            for (let attempt = 0; attempt < POLL_ATTEMPTS; attempt++) {
                if (attempt > 0) await wait(POLL_INTERVAL_MS);
                await queryClient.refetchQueries({ queryKey: ['active-plan'] });
                const plan = queryClient.getQueryData<GetAccountSubscriptionResponse>(['active-plan']);
                if (plan?.subscription && isUpdated(plan.subscription)) {
                    void queryClient.invalidateQueries({ queryKey: ['settings-account-usage'] });
                    return true;
                }
            }
            return false;
        },
        [queryClient],
    );
}
