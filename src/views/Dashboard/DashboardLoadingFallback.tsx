import { Suspense } from 'react';
import SaysoLoader from '@/components/SaysoLoader';
import lazyView from '@/utils/lazyView';

// Lazy so the skeleton (and the dashboard/shell CSS it pulls in) stays out of the entry chunk and
// only loads for `/`, instead of on login, settings, admin, etc.
const DashboardRouteSkeleton = lazyView(() => import('./components/DashboardRouteSkeleton'));

/** Loading state for `/`: AuthGuard's account/MFA wait and the Dashboard chunk's Suspense fallback. */
export default function DashboardLoadingFallback() {
    return (
        <Suspense fallback={<SaysoLoader />}>
            <DashboardRouteSkeleton />
        </Suspense>
    );
}
