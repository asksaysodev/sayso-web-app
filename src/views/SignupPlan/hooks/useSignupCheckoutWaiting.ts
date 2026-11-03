import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/context/AuthContext';
import useHasSubscription from '@/hooks/useHasSubscription';

import { onSignupCheckoutCanceled, setSignupCheckoutWaiting } from './signupCheckoutSignal';

const POLL_INTERVAL_MS = 5000;

/**
 * "Checkout open in another tab" state for /signup/plan (SAYSO-565).
 * While waiting: polls the account (interval + focus), leaves on cancel from the Stripe tab,
 * and advances to /signup/download once the subscription is active.
 */
export default function useSignupCheckoutWaiting() {
    const [waitingPriceId, setWaitingPriceId] = useState<string | null>(null);
    const { globalUser, updateGlobalUser } = useAuth();
    const hasSubscription = useHasSubscription();
    const navigate = useNavigate();
    const isWaiting = waitingPriceId !== null;
    const email = globalUser?.email;

    const startWaiting = useCallback((priceId: string) => {
        setSignupCheckoutWaiting(true);
        setWaitingPriceId(priceId);
    }, []);

    const stopWaiting = useCallback(() => {
        setSignupCheckoutWaiting(false);
        setWaitingPriceId(null);
    }, []);

    useEffect(() => {
        if (!isWaiting || !email) return;
        const refresh = () => {
            if (document.visibilityState === 'hidden') return;
            void updateGlobalUser(email).catch(() => undefined);
        };
        const interval = window.setInterval(refresh, POLL_INTERVAL_MS);
        window.addEventListener('focus', refresh);
        document.addEventListener('visibilitychange', refresh);
        return () => {
            window.clearInterval(interval);
            window.removeEventListener('focus', refresh);
            document.removeEventListener('visibilitychange', refresh);
        };
    }, [isWaiting, email, updateGlobalUser]);

    useEffect(() => {
        if (!isWaiting) return;
        return onSignupCheckoutCanceled(stopWaiting);
    }, [isWaiting, stopWaiting]);

    useEffect(() => {
        if (isWaiting && hasSubscription) {
            // The flag is still set, so the route guard also sends us here; navigate explicitly too.
            navigate('/signup/download', { replace: true });
        }
    }, [isWaiting, hasSubscription, navigate]);

    // Leaving the page without finishing must not leave a stale flag behind.
    useEffect(() => () => setSignupCheckoutWaiting(false), []);

    return { waitingPriceId, startWaiting, stopWaiting };
}
