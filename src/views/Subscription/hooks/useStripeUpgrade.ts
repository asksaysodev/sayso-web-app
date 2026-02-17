import { useMutation, useQueryClient } from "@tanstack/react-query";
import upgradeTrialSubscription from "../services/upgradeTrialSubscription";
import { useToast } from "@/context/ToastContext";
import * as Sentry from "@sentry/react";

export default function useStripeUpgrade() {
    const { showToast } = useToast();
    const queryClient = useQueryClient();

    const { mutate, isPending, isError } = useMutation({
        mutationFn: upgradeTrialSubscription,
        onSuccess: () => {
            showToast('success', 'Subscription upgraded successfully');
            queryClient.invalidateQueries({ queryKey: ['active-plan'] });
        },
        onError: (error) => {
            Sentry.captureException(error);
            showToast('error', 'Error upgrading subscription');
        }
    })

    return {
        mutateUpgradeTrialSubscription: mutate,
        isPendingUpgradeTrialSubscription: isPending,
        isErrorUpgradeTrialSubscription: isError
    }
}
