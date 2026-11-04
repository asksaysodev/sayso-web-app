import { useMutation } from "@tanstack/react-query";
import getStripeCheckoutPageUrl from "../services/getStripeCheckoutPageUrl";
import { useToast } from "@/context/ToastContext";
import * as Sentry from "@sentry/react";
import type { CheckoutFlow } from "../types";

interface Options {
    flow?: CheckoutFlow;
    /** Called once the checkout URL was loaded into the new tab (not on same-tab fallback). */
    onOpened?: (stripePriceId: string) => void;
}

interface Variables {
    stripePriceId: string;
    newTab: Window | null;
}

export default function useStripeCheckout({ flow, onOpened }: Options = {}) {
    const { showToast } = useToast();

    const { mutate, isPending, isError } = useMutation({
        mutationFn: ({ stripePriceId }: Variables) => getStripeCheckoutPageUrl(stripePriceId, flow),
        onSuccess: (data, { stripePriceId, newTab }) => {
            if (newTab && !newTab.closed) {
                newTab.location.href = data.url;
                onOpened?.(stripePriceId);
            } else {
                // Popup blocked (or the blank tab was closed meanwhile): continue in this tab.
                window.location.assign(data.url);
            }
        },
        onError: (error, { newTab }) => {
            newTab?.close();
            Sentry.captureException(error);
            showToast('error', 'Error getting stripe checkout page url');
        }
    })

    // window.open must run synchronously in the click handler, before the async request,
    // or Safari/Chrome popup blockers reject it.
    const startCheckout = (stripePriceId: string) => {
        if (isPending) return;
        const newTab = window.open('', '_blank');
        if (newTab) {
            try {
                newTab.opener = null;
            } catch {
                // Some browsers disallow it; the tab still works.
            }
        }
        mutate({ stripePriceId, newTab });
    };

    return {
        mutateGetStripeCheckoutPageUrl: startCheckout,
        isPendingGetStripeCheckoutPageUrl: isPending,
        isErrorGetStripeCheckoutPageUrl: isError
    }
}
