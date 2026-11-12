import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import useHasSubscription from '@/hooks/useHasSubscription';
import { useDownloadModalStore } from '@/store/downloadModalStore';

const DISMISSED_KEY = 'sayso-download-spotlight-dismissed';
const REFRESH_MIN_INTERVAL_MS = 30_000;

function readDismissed(): boolean {
    try {
        return sessionStorage.getItem(DISMISSED_KEY) === '1';
    } catch {
        return false;
    }
}

/**
 * Who the coach mark is for: individual accounts (whatever the role, so a future role change
 * there doesn't silently hide it), and team members with the `user` role. Team owners and admins
 * mostly manage, so they never get it; the Download modal is still one click away for them.
 * Superadmins (Sayso staff) always qualify, for testing.
 */
export function isDownloadSpotlightAudience(account: { account_type?: string; role?: string } | null | undefined): boolean {
    if (!account) return false;
    // Internal Sayso staff, so the flow can be tested on any account type.
    if (account.role === 'superadmin') return true;
    if (account.account_type === 'individual') return true;
    return account.account_type === 'team' && account.role === 'user';
}

/**
 * Post-sign-up coach mark on the sidebar "Download Sayso" button. Sign-up lands on the
 * dashboard instead of a download step, so this points new users at the desktop app.
 * Shows on the dashboard until the desktop app's first sign-in (it then writes
 * desktop_app_latest_version on the account); clicking Download or closing it hides it for
 * this browser session only, so it comes back on the next visit.
 */
export default function useDownloadSpotlight(active: boolean) {
    const { globalUser, updateGlobalUser } = useAuth();
    const hasSubscription = useHasSubscription();
    const { pathname, search } = useLocation();
    const modalOpen = useDownloadModalStore(state => state.open);
    const lastRefreshRef = useRef(0);
    const [dismissed, setDismissed] = useState(readDismissed);

    // Non-subscribers see the plans empty state on the dashboard, not the desktop nudge.
    const enabled = active && !!globalUser?.id && isDownloadSpotlightAudience(globalUser) && hasSubscription && pathname === '/' && !dismissed && !modalOpen;

    const hasUsedDesktop = !!globalUser?.desktop_app_latest_version;
    const email = globalUser?.email;

    // The account isn't refetched on focus elsewhere: while the coach mark shows, refresh it when the
    // user comes back to the tab (typically from installing), so it disappears after the desktop sign-in.
    useEffect(() => {
        if (!enabled || hasUsedDesktop || !email) return;
        const refresh = () => {
            if (document.visibilityState !== 'visible') return;
            // Throttled: a full account fetch per tab switch is too much for frequent switchers.
            const now = Date.now();
            if (now - lastRefreshRef.current < REFRESH_MIN_INTERVAL_MS) return;
            lastRefreshRef.current = now;
            void updateGlobalUser(email).catch(() => undefined);
        };
        document.addEventListener('visibilitychange', refresh);
        return () => document.removeEventListener('visibilitychange', refresh);
    }, [enabled, hasUsedDesktop, email, updateGlobalUser]);

    const dismiss = useCallback(() => {
        try {
            sessionStorage.setItem(DISMISSED_KEY, '1');
        } catch {
            // storage unavailable: hide for this page load only
        }
        setDismissed(true);
    }, []);

    // Dev-only preview for accounts that already signed in on desktop: add ?spotlight=1 to the URL.
    const devForce = import.meta.env.DEV && new URLSearchParams(search).has('spotlight');

    return { visible: enabled && (!hasUsedDesktop || devForce), dismiss };
}
