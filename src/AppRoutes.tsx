import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

import AuthGuard from './components/guards/AuthGuard';
import GuestGuard from './components/guards/GuestGuard';
import MFAGuard from './components/guards/MFAGuard';
import Layout from './components/Layout';

import Login from './views/Login';
import PasswordRecovery from './views/PasswordRecovery';
import ResetPassword from './views/ResetPassword';

const Dashboard = lazy(() => import('./views/Dashboard'));
const Settings = lazy(() => import('./views/Settings'));
const Checkout = lazy(() => import('./views/Checkout'));
const Admin = lazy(() => import('./views/Admin'));
const Subscription = lazy(() => import('./views/Subscription'));
const MFAVerify = lazy(() => import('./views/MFAVerify'));

import SaysoLoader from './components/SaysoLoader';
import useHasSubscription from './hooks/useHasSubscription';

export default function AppRoutes() {
    const hasSubscription = useHasSubscription();

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
                            {hasSubscription
                                ? <Layout><Subscription /></Layout>
                                : <Subscription />
                            }
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
        </Suspense>
    )
}
