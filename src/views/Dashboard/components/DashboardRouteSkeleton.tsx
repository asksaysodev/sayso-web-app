import AppShellSkeleton from '@/components/AppShellSkeleton/AppShellSkeleton';
import { useAuth } from '@/context/AuthContext';
import useHasSubscription from '@/hooks/useHasSubscription';
import { readSubscriptionHint } from '../utils/subscriptionHint';
import DashboardSkeleton from './DashboardSkeleton';

/**
 * Picks the placeholder for `/` that matches what will render: the widget skeleton for
 * subscribers, and just the app shell for users who will get the no-plan empty state.
 * Before the account loads, it goes by what this user's dashboard showed last time
 * (unknown → widgets, the common case).
 */
export default function DashboardRouteSkeleton() {
    const { user, globalUser } = useAuth();
    const hasSubscription = useHasSubscription();
    const expectsWidgets = globalUser ? hasSubscription : readSubscriptionHint(user?.id) !== false;

    if (expectsWidgets) return <DashboardSkeleton />;

    return (
        <AppShellSkeleton>
            <main className='dashboard-page' aria-busy='true' aria-label='Loading dashboard' />
        </AppShellSkeleton>
    );
}
