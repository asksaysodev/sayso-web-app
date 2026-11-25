import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import { getAAL } from '@/services/mfaServices';

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
  const { user, globalUser, loading = true, userLoading, accountUnavailable, retryAccountFetch, checkIfNeedsMFA, signedOutByUser } = useAuth();
  const location = useLocation();
  const requestedPath = useRequestedPath();
  const navigate = useNavigate();
  const [isCheckingMFA, setIsCheckingMFA] = useState(true);

  useEffect(() => {
    const checkMFAStatus = async () => {
      if (!globalUser) {
        setIsCheckingMFA(false);
        return;
      }

      const aalResult = await getAAL();

      if (aalResult.error || !aalResult.data) {
        navigate('/mfa-verify', { replace: true, state: toIntendedState(requestedPath) });
        return;
      }

      const needsMFA = checkIfNeedsMFA(aalResult.data.currentLevel, aalResult.data.nextLevel);

      if (needsMFA) {
        navigate('/mfa-verify', { replace: true, state: toIntendedState(requestedPath) });
      } else {
        setIsCheckingMFA(false);
      }
    };

    if (!loading && !userLoading) {
      checkMFAStatus();
    }
  }, [globalUser, loading, userLoading, checkIfNeedsMFA, navigate, requestedPath]);

  // Optimistic sign-up (useOptimisticSignupStore): /signup/plan is shown while the account is
  // created and loaded, instead of the logo loader. Same tree shape as the normal return below,
  // so the plan view doesn't remount when the account lands. A failed account fetch still falls
  // through to AccountUnavailable rather than leaving the user on a plan page that can't check out.
  const optimisticStatus = useOptimisticSignupStore((state) => state.status);
  const resetOptimisticSignup = useOptimisticSignupStore((state) => state.reset);
  const isOptimisticSignup =
    isOptimisticSignupActive(optimisticStatus) && location.pathname === '/signup/plan' && !accountUnavailable;
  const isAccountSettled = !loading && !userLoading && !isCheckingMFA && !!user && !!globalUser;

  // Done once the account has loaded, or once loading it failed (AccountUnavailable takes over);
  // a 'created' status left behind would keep AppRoutes skipping the billing check.
  useEffect(() => {
    if (optimisticStatus === 'created' && (isAccountSettled || accountUnavailable)) resetOptimisticSignup();
  }, [optimisticStatus, isAccountSettled, accountUnavailable, resetOptimisticSignup]);

  if (isOptimisticSignup && !isAccountSettled) {
    return <SubscriptionGuard>{children}</SubscriptionGuard>;
  }

  // The logo loader covers only session restore (`loading`), which is near-instant.
  // Once a session exists, the slow part is the account fetch + MFA check. If the user
  // is headed to the dashboard, show its skeleton so the page appears to load in place.
  if (loading) {
    return <SaysoLoader />;
  }

  if (userLoading || isCheckingMFA) {
    return user && location.pathname === '/' ? <DashboardLoadingFallback /> : <SaysoLoader />;
  }

  // Only the absence of a Supabase session means signed out. A failed account
  // fetch is not authentication state, and routing it to /login told users they
  // were logged out when they were not (SAYSO-342).
  if (!user) {
    return <Navigate to="/login" state={signedOutByUser ? null : toIntendedState(requestedPath)} replace />;
  }

  if (accountUnavailable || !globalUser) {
    return <AccountUnavailable onRetry={retryAccountFetch} />;
  }

  return <SubscriptionGuard>{children}</SubscriptionGuard>;
};

export default AuthGuard; 