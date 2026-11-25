import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import useMFAStatus from '@/hooks/useMFAStatus';

import '../../styles/AuthGuard.css'
import { useAuth } from '@/context/AuthContext';
import { useRequestedPath } from '@/context/RequestedPathContext';
import { toIntendedState } from '@/utils/intendedPath';
import { isOptimisticSignupActive, useOptimisticSignupStore } from '@/store/optimisticSignupStore';
import SaysoLoader from '../SaysoLoader';
import AccountUnavailable from '../AccountUnavailable';
import SubscriptionGuard from './SubscriptionGuard';
import DashboardLoadingFallback from '@/views/Dashboard/DashboardLoadingFallback';

interface Props {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: Props) => {
  const { user, globalUser, loading = true, userLoading, accountUnavailable, retryAccountFetch, signedOutByUser } = useAuth();
  const location = useLocation();
  const requestedPath = useRequestedPath();
  const mfaStatus = useMFAStatus();

  // Optimistic sign-up (useOptimisticSignupStore): /signup/plan is shown while the account is
  // created and loaded, instead of the logo loader. Same tree shape as the normal return below,
  // so the plan view doesn't remount when the account lands. A failed account fetch still falls
  // through to AccountUnavailable rather than leaving the user on a plan page that can't check out.
  const optimisticStatus = useOptimisticSignupStore((state) => state.status);
  const resetOptimisticSignup = useOptimisticSignupStore((state) => state.reset);
  const isOptimisticSignup =
    isOptimisticSignupActive(optimisticStatus) && location.pathname === '/signup/plan' && !accountUnavailable;
  const isAccountSettled = !loading && !userLoading && mfaStatus === 'clear' && !!user && !!globalUser;

  // Done once the account has loaded, or once loading it failed (AccountUnavailable takes over);
  // a 'created' status left behind would keep AppRoutes skipping the billing check.
  useEffect(() => {
    if (optimisticStatus === 'created' && (isAccountSettled || accountUnavailable)) resetOptimisticSignup();
  }, [optimisticStatus, isAccountSettled, accountUnavailable, resetOptimisticSignup]);

  if (mfaStatus === 'required') {
    return <Navigate to="/mfa-verify" state={toIntendedState(requestedPath)} replace />;
  }

  if (isOptimisticSignup && !isAccountSettled) {
    return <SubscriptionGuard>{children}</SubscriptionGuard>;
  }

  if (loading) {
    return <SaysoLoader />;
  }

  // Only the absence of a Supabase session means signed out. A failed account
  // fetch is not authentication state, and routing it to /login told users they
  // were logged out when they were not (SAYSO-342).
  if (!user) {
    return <Navigate to="/login" state={signedOutByUser ? null : toIntendedState(requestedPath)} replace />;
  }

  // Nothing of the app, not even a skeleton, before MFA is settled (SAYSO-633).
  if (mfaStatus === 'checking') {
    return <SaysoLoader />;
  }

  // The slow part is the account fetch. If the user is headed to the dashboard, show its
  // skeleton so the page appears to load in place.
  if (userLoading) {
    return location.pathname === '/' ? <DashboardLoadingFallback /> : <SaysoLoader />;
  }

  if (accountUnavailable || !globalUser) {
    return <AccountUnavailable onRetry={retryAccountFetch} />;
  }

  return <SubscriptionGuard>{children}</SubscriptionGuard>;
};

export default AuthGuard; 