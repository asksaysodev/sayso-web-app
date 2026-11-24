import { useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import reportApiError from '@/utils/reportApiError';
import type { GetAccountSubscriptionResponse } from '../types';
import { getRetentionErrorCode, getRetentionErrorMessage, isUnconfirmed } from '../utils/retentionError';
import useRefreshActivePlan from './useRefreshActivePlan';

export const RETENTION_ACTION_KEY = ['retention-action'];

interface Options<Variables, Result> {
    operation: string;
    request: (variables: Variables) => Promise<Result>;
    isUpdated: (subscription: GetAccountSubscriptionResponse['subscription']) => boolean;
    /** The refusal that means an earlier unconfirmed attempt was applied, and that attempt's result. */
    alreadyDone?: { code: string; toResult: (variables: Variables) => Result };
}

/** A billing change whose outcome is never left in doubt: see `isUnconfirmed` and `alreadyDone`. */
export default function useRetentionAction<Variables, Result>({
    operation,
    request,
    isUpdated,
    alreadyDone,
}: Options<Variables, Result>) {
    const refreshActivePlan = useRefreshActivePlan();
    const unconfirmedRef = useRef<{ variables: Variables } | null>(null);

    const { mutate, isPending, error } = useMutation({
        mutationKey: RETENTION_ACTION_KEY,
        mutationFn: async (variables: Variables) => {
            try {
                return await request(variables);
            } catch (requestError) {
                reportApiError(requestError, { feature: 'retention', operation });
                const unconfirmed = unconfirmedRef.current;
                if (unconfirmed && alreadyDone && getRetentionErrorCode(requestError) === alreadyDone.code) {
                    return alreadyDone.toResult(unconfirmed.variables);
                }
                if (isUnconfirmed(requestError)) unconfirmedRef.current ??= { variables };
                throw requestError;
            }
        },
        onSuccess: () => {
            void refreshActivePlan(isUpdated);
        },
        onError: (mutationError) => {
            if (isUnconfirmed(mutationError)) void refreshActivePlan(isUpdated);
        },
    });

    return {
        run: mutate,
        isPending,
        errorMessage: error ? getRetentionErrorMessage(error) : null,
    };
}
