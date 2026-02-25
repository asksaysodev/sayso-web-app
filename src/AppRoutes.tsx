import { useMemo, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import AuthGuard from './components/AuthGuard';
import GuestGuard from './components/GuestGuard';
import MFAGuard from './components/MFAGuard';
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

import { useAuth } from './context/AuthContext';
import SaysoLoader from './components/SaysoLoader';

export default function AppRoutes() {
    const { globalUser } = useAuth();
    const hasSubscription = useMemo(() => !!globalUser?.subscription_plan_id, [globalUser]);

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
                            {hasSubscription ? <Dashboard /> : <Navigate to="/subscription" replace />}
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
                    path="/checkout"
                    element={
                        <AuthGuard>
                        <Layout>
                            <Checkout />
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
                        <Layout>
                            <Subscription />
                        </Layout>
                        </AuthGuard>
                    }
                />
                <Route
                    path="/checkout/success"
                    element={
                        <AuthGuard>
                        <Layout>
                            <Checkout />
                        </Layout>
                        </AuthGuard>
                    }
                />
            </Routes>
        </Suspense>
    )
}
