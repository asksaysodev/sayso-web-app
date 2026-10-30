import { Navigate, useLocation } from 'react-router-dom';
import useHasSubscription from '@/hooks/useHasSubscription';

// The /signup/* steps run before the user has picked a plan (SAYSO-523).
const AVAILABABLE_ROUTES_WITHOUT_SUBSCRIPTION = [
    '/subscription',
    '/checkout',
    '/checkout/success',
    '/signup/plan',
    '/signup/download',
];

interface Props {
    children: React.ReactNode;
}

export default function SubscriptionGuard({ children }: Props) {
    const hasSubscription = useHasSubscription();
    const { pathname } = useLocation();

    if (!hasSubscription && !AVAILABABLE_ROUTES_WITHOUT_SUBSCRIPTION.includes(pathname)) {
        return <Navigate to="/subscription" replace />;
    }

    return children;
}
