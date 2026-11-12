import { Navigate, useLocation } from 'react-router-dom';
import useHasSubscription from '@/hooks/useHasSubscription';

// The /signup/* steps run before the user has picked a plan (SAYSO-523). The dashboard
// (`/`) is reachable too: "Skip subscription" lands there and Dashboard renders an empty
// state with a link to the plans instead of any subscriber data (SAYSO-563).
const AVAILABABLE_ROUTES_WITHOUT_SUBSCRIPTION = [
    '/',
    '/subscription',
    '/checkout',
    '/checkout/success',
    '/signup/plan',
    // Stripe's sign-up success_url; it redirects to '/', but the webhook may not have landed yet.
    '/signup/download',
    // Old download links: redirect to '/' with the Download modal open, subscribed or not.
    '/download',
];

interface Props {
    children: React.ReactNode;
}

export default function SubscriptionGuard({ children }: Props) {
    const hasSubscription = useHasSubscription();
    const { pathname } = useLocation();

    if (!hasSubscription && !AVAILABABLE_ROUTES_WITHOUT_SUBSCRIPTION.includes(pathname)) {
        return <Navigate to="/signup/plan" replace />;
    }

    return children;
}
