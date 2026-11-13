import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import { getAAL } from '@/services/mfaServices';

import '../../styles/AuthGuard.css'
import { useAuth } from '@/context/AuthContext';
import SaysoLoader from '../SaysoLoader';
import AccountUnavailable from '../AccountUnavailable';
import SubscriptionGuard from './SubscriptionGuard';
import DashboardSkeleton from '@/views/Dashboard/components/DashboardSkeleton';

interface Props {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: Props) => {
  const { user, globalUser, loading = true, userLoading, accountUnavailable, retryAccountFetch, checkIfNeedsMFA } = useAuth();
  const location = useLocation();
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
        navigate('/mfa-verify', { replace: true });
        return;
      }

      const needsMFA = checkIfNeedsMFA(aalResult.data.currentLevel, aalResult.data.nextLevel);

      if (needsMFA) {
        navigate('/mfa-verify', { replace: true });
      } else {
        setIsCheckingMFA(false);
      }
    };

    if (!loading && !userLoading) {
      checkMFAStatus();
    }
  }, [globalUser, loading, userLoading, checkIfNeedsMFA, navigate]);

  // The logo loader covers only session restore (`loading`), which is near-instant.
  // Once a session exists, the slow part is the account fetch + MFA check. If the user
  // is headed to the dashboard, show its skeleton so the page appears to load in place.
  if (loading) {
    return <SaysoLoader />;
  }

  if (userLoading || isCheckingMFA) {
    return user && location.pathname === '/' ? <DashboardSkeleton /> : <SaysoLoader />;
  }

  // Only the absence of a Supabase session means signed out. A failed account
  // fetch is not authentication state, and routing it to /login told users they
  // were logged out when they were not (SAYSO-342).
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (accountUnavailable || !globalUser) {
    return <AccountUnavailable onRetry={retryAccountFetch} />;
  }

  return <SubscriptionGuard>{children}</SubscriptionGuard>;
};

export default AuthGuard; 