import { Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import AuthGuard from './components/guards/AuthGuard';
import GuestGuard from './components/guards/GuestGuard';
import SignupGuestGuard from './components/guards/SignupGuestGuard';
import MFAGuard from './components/guards/MFAGuard';
import Layout from './components/Layout';
import SettingsModalRoute from './components/SettingsModalRoute';
import { useDownloadModalStore } from './store/downloadModalStore';
import { useMediaQuery } from './hooks/useMediaQuery';
import type { SettingsLocationState } from './views/Settings/types';

import Login from './views/Login';
import PasswordRecovery from './views/PasswordRecovery';
import ResetPassword from './views/ResetPassword';
import lazyView from './utils/lazyView';
import { getIntendedPath } from './utils/intendedPath';

const Dashboard = lazyView(() => import('./views/Dashboard'));
const Settings = lazyView(() => import('./views/Settings'));
const Marketplace = lazyView(() => import('./views/Marketplace'));
const Checkout = lazyView(() => import('./views/Checkout'));
const Admin = lazyView(() => import('./views/Admin'));
const SignupPlan = lazyView(() => import('./views/SignupPlan'));
const MFAVerify = lazyView(() => import('./views/MFAVerify'));
const AcceptInvite = lazyView(() => import('./views/AcceptInvite'));
const Organization = lazyView(() => import('./views/Organization'));
const Conversations = lazyView(() => import('./views/Conversations'));
const TeamDetail = lazyView(() => import('./views/Organization/Teams/Detail'));
const Signup = lazyView(() => import('./views/Signup'));

import SaysoLoader from './components/SaysoLoader';
import DashboardLoadingFallback from './views/Dashboard/DashboardLoadingFallback';
import useHasSubscription from './hooks/useHasSubscription';
import useCanManageBilling from './hooks/useCanManageBilling';
import useIsTeamAdmin from './hooks/useIsTeamAdmin';
import { isOptimisticSignupActive, useOptimisticSignupStore } from './store/optimisticSignupStore';


export default function AppRoutes() {
    const hasSubscription = useHasSubscription();
    const canManageBilling = useCanManageBilling();
    const isTeamAdmin = useIsTeamAdmin();
    const optimisticSignupStatus = useOptimisticSignupStore((state) => state.status);
    const optimisticSignupReturnTo = useOptimisticSignupStore((state) => state.returnTo);
    const location = useLocation();
    const isMobile = useMediaQuery('(max-width: 767px)');

    // Desktop settings is a modal: the routes keep rendering the page it was opened from (dashboard on a direct load).
    const isSettingsOverlay = !isMobile && location.pathname === '/settings';
    const routesLocation = isSettingsOverlay
        ? (location.state as SettingsLocationState | null)?.backgroundLocation ?? '/'
        : location;

    return (
        <Suspense fallback={<SaysoLoader />}>
            <Routes location={routesLocation}>
                <Route
                    path="/login"
                    element={<LoginRoute />}
                />
                <Route
                    path="/signup"
                    element={
                        <SignupGuestGuard>
                            <Signup />
                        </SignupGuestGuard>
                    }
                />
                <Route
                    path="/signup/plan"
                    element={
                        // Optimistic sign-up failed (the toast is already up): back to the form, restored.
                        optimisticSignupStatus === 'failed'
                            ? <Navigate to={optimisticSignupReturnTo} replace />
                            : <AuthGuard>
                            {/* No account yet during an optimistic sign-up; self sign-ups can always bill. */}
                            {!canManageBilling && !isOptimisticSignupActive(optimisticSignupStatus)
                                ? <Navigate to="/" replace />
                                : hasSubscription
                                    // Subscribers manage their plan in Account settings; this route is the pricing page.
                                    ? <Navigate to="/settings?tab=subscription" replace />
                                    : <SignupPlan />
                            }
                        </AuthGuard>
                    }
                />
                {/* Sign-up ends on the dashboard, where the sidebar Download button is highlighted
                    (useDownloadSpotlight). Kept as a redirect: Stripe's sign-up success_url still lands here. */}
                <Route
                    path="/signup/download"
                    element={
                        <AuthGuard>
                            <Navigate to="/" replace />
                        </AuthGuard>
                    }
                />
                <Route
                    path="/forgot-password"
                    element={
                        <GuestGuard>
                        <PasswordRecovery />
                        </GuestGuard>
                    }
                />
                <Route
                    path="/reset-password"
                    element={<ResetPassword />}
                />
                <Route
                    path="/accept-invite"
                    element={<AcceptInvite />}
                />
                <Route
                    path="/mfa-verify"
                    element={
                        <MFAGuard>
                        <MFAVerify />
                        </MFAGuard>
                    }
                />
                <Route
                    path="/"
                    element={
                        <AuthGuard>
                            {/* Own boundary so the chunk load continues the AuthGuard skeleton instead of flashing the logo loader. */}
                            <Suspense fallback={<DashboardLoadingFallback />}>
                                <Layout>
                                    <Dashboard />
                                </Layout>
                            </Suspense>
                        </AuthGuard>
                    }
                />
                <Route
                    path="/conversations"
                    element={
                        <AuthGuard>
                            <Layout>
                                <Conversations />
                            </Layout>
                        </AuthGuard>
                    }
                />
                <Route
                    path="/company"
                    element={
                        <AuthGuard>
                            {isTeamAdmin
                                ? <Layout><Organization /></Layout>
                                : <Navigate to="/" replace />
                            }
                        </AuthGuard>
                    }
                />
                <Route
                    path="/company/teams/:teamId"
                    element={
                        <AuthGuard>
                            {isTeamAdmin
                                ? <Layout><TeamDetail /></Layout>
                                : <Navigate to="/" replace />
                            }
                        </AuthGuard>
                    }
                />
                {/* Pre-rename URLs (SAYSO-504): keep old links and bookmarks working. */}
                <Route path="/organization/*" element={<OrganizationRedirect />} />
                <Route
                    path="/marketplace"
                    element={
                        <AuthGuard>
                            <Layout>
                                <Marketplace />
                            </Layout>
                        </AuthGuard>
                    }
                />
                {/* Mobile only; desktop renders SettingsModalRoute over the current page. */}
                <Route
                    path="/settings"
                    element={
                        <AuthGuard>
                        <Layout>
                            <Settings />
                        </Layout>
                        </AuthGuard>
                    }
                />
                <Route
                    path="/admin"
                    element={
                        <AuthGuard>
                        <Layout>
                            <Admin />
                        </Layout>
                        </AuthGuard>
                    }
                />
                <Route
                    path="/subscription"
                    element={
                        <AuthGuard>
                            {!canManageBilling
                                ? <Navigate to="/" replace />
                                : hasSubscription
                                    // Subscribers manage their plan in Account settings; this route is the pricing page.
                                    ? <Navigate to="/settings?tab=subscription" replace />
                                    // One pricing view: the old URL keeps working for emails and bookmarks.
                                    : <RedirectKeepingQuery to="/signup/plan" />
                            }
                        </AuthGuard>
                    }
                />
                {/* The download page is now a modal; old links land on the dashboard with it open. */}
                <Route
                    path="/download"
                    element={
                        <AuthGuard>
                            <OpenDownloadModal />
                        </AuthGuard>
                    }
                />
                <Route
                    path="/checkout"
                    element={
                        <AuthGuard>
                            <Checkout />
                        </AuthGuard>
                    }
                />
                <Route
                    path="/checkout/success"
                    element={
                        <AuthGuard>
                            <Checkout />
                        </AuthGuard>
                    }
                />
            </Routes>
            {isSettingsOverlay && <SettingsModalRoute />}
        </Suspense>
    )
}

/**
 * /login is login-only. Sign-up links in emails, the marketing site and the desktop app
 * (?signup=true, ?referralCode=, ?invite=) move to /signup with every query param kept.
 */
function LoginRoute() {
    const { search, hash, state } = useLocation();
    const params = new URLSearchParams(search);
    const isSignupLink = params.get('signup') === 'true'
        || !!params.get('referralCode')
        || !!params.get('invite');

    if (isSignupLink) {
        return <Navigate to={`/signup${search}${hash}`} replace />;
    }

    return (
        <GuestGuard redirectTo={getIntendedPath(state)}>
            <Login />
        </GuestGuard>
    );
}

function RedirectKeepingQuery({ to }: { to: string }) {
    const { search, hash } = useLocation();
    return <Navigate to={`${to}${search}${hash}`} replace />;
}

/** /organization[/…][?…][#…] → /company[/…][?…][#…] */
function OrganizationRedirect() {
    const { pathname, search, hash } = useLocation();
    return <Navigate to={pathname.replace(/^\/organization/, '/company') + search + hash} replace />;
}

function OpenDownloadModal() {
    const openDownloadModal = useDownloadModalStore(state => state.setOpen);
    useEffect(() => openDownloadModal(true), [openDownloadModal]);
    return <Navigate to="/" replace />;
}
