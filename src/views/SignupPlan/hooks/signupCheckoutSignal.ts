/** Cross-tab plumbing for the sign-up checkout waiting state (SAYSO-565). */

const CHANNEL = 'sayso-signup-checkout';
const WAITING_KEY = 'sayso-signup-checkout-waiting';
const CANCEL_KEY = 'sayso-signup-checkout-canceled';

/** Per-tab flag: this tab is waiting for a sign-up payment (read by the /signup/plan route). */
export function setSignupCheckoutWaiting(waiting: boolean) {
    try {
        if (waiting) sessionStorage.setItem(WAITING_KEY, '1');
        else sessionStorage.removeItem(WAITING_KEY);
    } catch {
        // storage unavailable
    }
}

export function isSignupCheckoutWaiting(): boolean {
    try {
        return sessionStorage.getItem(WAITING_KEY) === '1';
    } catch {
        return false;
    }
}

/** Tell the waiting tab (if any) that the user canceled in Stripe. */
export function broadcastSignupCheckoutCanceled() {
    if (typeof BroadcastChannel !== 'undefined') {
        const channel = new BroadcastChannel(CHANNEL);
        channel.postMessage('canceled');
        channel.close();
    }
    try {
        // `storage` events fire in other tabs only; the fallback for no BroadcastChannel.
        localStorage.setItem(CANCEL_KEY, String(Date.now()));
    } catch {
        // storage unavailable
    }
}

/** Subscribe to cancel signals from other tabs. Returns the unsubscribe function. */
export function onSignupCheckoutCanceled(callback: () => void): () => void {
    const channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel(CHANNEL) : null;
    if (channel) channel.onmessage = (event) => event.data === 'canceled' && callback();
    const onStorage = (event: StorageEvent) => {
        if (event.key === CANCEL_KEY) callback();
    };
    window.addEventListener('storage', onStorage);
    return () => {
        channel?.close();
        window.removeEventListener('storage', onStorage);
    };
}
