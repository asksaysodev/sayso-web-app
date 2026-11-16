import { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import useHasSubscription from '@/hooks/useHasSubscription';

const SettingsModal = lazy(() => import('@/views/Settings/SettingsModal'));

/**
 * Desktop `/settings` overlay. The page underneath runs its own AuthGuard (login/MFA redirects);
 * this waits for the account and keeps the subscription gate the full page used to get from SubscriptionGuard.
 */
export default function SettingsModalRoute() {
    const { globalUser, userLoading } = useAuth();
    const hasSubscription = useHasSubscription();

    if (!globalUser || userLoading) return null;
    if (!hasSubscription) return <Navigate to='/signup/plan' replace />;

    return (
        <Suspense fallback={null}>
            <SettingsModal />
        </Suspense>
    );
}
