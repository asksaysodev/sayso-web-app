import { Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import useMFAStatus from '@/hooks/useMFAStatus';
import useHasSubscription from '@/hooks/useHasSubscription';
import lazyView from '@/utils/lazyView';

const SettingsModal = lazyView(() => import('@/views/Settings/SettingsModal'));

/**
 * Desktop `/settings` overlay. The page underneath runs its own AuthGuard (login/MFA redirects);
 * this waits for MFA and the account, and keeps the subscription gate the full page used to get from SubscriptionGuard.
 */
export default function SettingsModalRoute() {
    const { globalUser, userLoading, accountUnavailable } = useAuth();
    const mfaStatus = useMFAStatus();
    const hasSubscription = useHasSubscription();

    if (!globalUser || accountUnavailable || userLoading || mfaStatus !== 'clear') return null;
    if (!hasSubscription) return <Navigate to='/signup/plan' replace />;

    return (
        <Suspense fallback={null}>
            <SettingsModal />
        </Suspense>
    );
}
