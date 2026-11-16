import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import getStripeCheckoutPageUrl from "../services/getStripeCheckoutPageUrl";
import { useToast } from "@/context/ToastContext";
import * as Sentry from "@sentry/react";
import type { CheckoutFlow } from "../types";

interface Options {
    flow?: CheckoutFlow;
}

/**
 * Sends the user to Stripe Checkout in this tab, on every device. Stripe's success_url /
 * cancel_url (picked by `flow`) bring them back.
 */
export default function useStripeCheckout({ flow }: Options = {}) {
    const { showToast } = useToast();
    // The page keeps running while the browser loads Stripe; stay "pending" until it's gone
    // so the CTA can't be clicked twice.
    const [isRedirecting, setIsRedirecting] = useState(false);

    // Back from Stripe can restore this page from the back/forward cache, redirect flag included.
    useEffect(() => {
        const onPageShow = (event: PageTransitionEvent) => {
            if (event.persisted) setIsRedirecting(false);
        };
        window.addEventListener('pageshow', onPageShow);
        return () => window.removeEventListener('pageshow', onPageShow);
    }, []);

    const { mutate, isPending, isError } = useMutation({
        mutationFn: (stripePriceId: string) => getStripeCheckoutPageUrl(stripePriceId, flow),
        onSuccess: (data) => {
            setIsRedirecting(true);
            window.location.assign(data.url);
        },
        onError: (error) => {
            Sentry.captureException(error);
            showToast('error', 'Error getting stripe checkout page url');
        }
    })

    const isBusy = isPending || isRedirecting;
    const startCheckout = (stripePriceId: string) => {
        if (!isBusy) mutate(stripePriceId);
    };

    return {
        mutateGetStripeCheckoutPageUrl: startCheckout,
        isPendingGetStripeCheckoutPageUrl: isBusy,
        isErrorGetStripeCheckoutPageUrl: isError
    }
}
