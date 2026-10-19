import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import AuthGuard from './components/guards/AuthGuard';
import GuestGuard from './components/guards/GuestGuard';
import MFAGuard from './components/guards/MFAGuard';
import Layout from './components/Layout';

import Login from './views/Login';
import PasswordRecovery from './views/PasswordRecovery';
import ResetPassword from './views/ResetPassword';

const lazyView: typeof lazy = (factory) => lazy(() => factory().then((module) => module ?? new Promise<never>(() => {})));
const Dashboard = lazyView(() => import('./views/Dashboard'));
const Settings = lazyView(() => import('./views/Settings'));
const Marketplace = lazyView(() => import('./views/Marketplace'));
const Checkout = lazyView(() => import('./views/Checkout'));
const Admin = lazyView(() => import('./views/Admin'));
const Subscription = lazyView(() => import('./views/Subscription'));
const MFAVerify = lazyView(() => import('./views/MFAVerify'));
const AcceptInvite = lazyView(() => import('./views/AcceptInvite'));
const Organization = lazyView(() => import('./views/Organization'));
const Conversations = lazyView(() => import('./views/Conversations'));
const TeamDetail = lazyView(() => import('./views/Organization/Teams/Detail'));

import SaysoLoader from './components/SaysoLoader';
import useHasSubscription from './hooks/useHasSubscription';
import useUserNotAdminOnTeams from './hooks/useUserNotAdminOnTeams';
import useIsTeamAdmin from './hooks/useIsTeamAdmin';
import Download from './views/Download';


export default function AppRoutes() {
    const hasSubscription = useHasSubscription();
    const userNotAdminOnTeams = useUserNotAdminOnTeams();
    const isTeamAdmin = useIsTeamAdmin();

    return (
        <Suspense fallback={<SaysoLoader />}>
            <Routes>
                <Route
                    path="/login"
                    element={
                        <GuestGuard>
                        <Login />
                        </GuestGuard>
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
                        <Layout>
                            <Dashboard />
                        </Layout>
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
                            {userNotAdminOnTeams
                                ? <Navigate to="/" replace />
                                : hasSubscription
                                    // Subscribers manage their plan in Account settings; this route is the pricing page.
                                    ? <Navigate to="/settings?tab=subscription" replace />
                                    : <Subscription />
                            }
                        </AuthGuard>
                    }
                />
                <Route
                    path="/download"
                    element={
                        <Download />
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
        </Suspense>
    )
}

/** /organization[/…][?…][#…] → /company[/…][?…][#…] */
function OrganizationRedirect() {
    const { pathname, search, hash } = useLocation();
    return <Navigate to={pathname.replace(/^\/organization/, '/company') + search + hash} replace />;
}
