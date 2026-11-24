import { useMutation } from "@tanstack/react-query";
import getBillingPortalUrl from "../services/getBillingPortalUrl";
import { useToast } from "@/context/ToastContext";
import * as Sentry from "@sentry/react";
import { openExternal } from "@/utils/helpers/openExternal";

/** Opens the Stripe billing portal (payment methods, billing details, invoices) in a new tab. */
export default function useBillingPortal() {
    const { showToast } = useToast();

    const { mutate, isPending } = useMutation({
        mutationFn: getBillingPortalUrl,
        onSuccess: (data) => {
            openExternal(data.url);
        },
        onError: (error) => {
            Sentry.captureException(error);
            showToast('error', "Couldn't open the billing portal");
        }
    })

    return {
        openBillingPortal: () => mutate(),
        isPendingBillingPortal: isPending,
    }
}
