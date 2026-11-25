import { useAuth } from '@/context/AuthContext';
import useMFAStatus from '@/hooks/useMFAStatus';
import { toIntendedState } from '@/utils/intendedPath';
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import SaysoLoader from '../SaysoLoader';

const ACCOUNT_WAIT_MS = 8000;

interface Props {
  children: React.ReactNode;
  /**
   * Where a signed-in user goes. SignupGuestGuard sets it so the session that sign-up
   * itself creates continues the flow instead of racing to the dashboard.
   */
  redirectTo?: string;
  /** Keep the form up when the account doesn't exist. The form must then end the session. */
  holdOnAccountNotFound?: boolean;
}

/**
 * Owns the redirect after a sign-in. A form that was already on screen stays mounted until the
 * destination is known, so no page flashes on the way to MFA or to an error (SAYSO-633).
 */
const GuestGuard = ({ children, redirectTo = '/', holdOnAccountNotFound = false }: Props) => {
  const { user, loading, userLoading, accountNotFound } = useAuth();
  const mfaStatus = useMFAStatus();
  const [mountedAsGuest] = useState(!user);
  const [waitedTooLong, setWaitedTooLong] = useState(false);
  const isWaitingForAccount = !!user && mfaStatus === 'clear' && userLoading;

  useEffect(() => {
    if (!isWaitingForAccount) return;
    const timer = window.setTimeout(() => setWaitedTooLong(true), ACCOUNT_WAIT_MS);
    return () => window.clearTimeout(timer);
  }, [isWaitingForAccount]);

  if (loading) {
    return <SaysoLoader />;
  }

  if (!user) {
    return children;
  }

  if (mfaStatus === 'required') {
    return <Navigate to="/mfa-verify" state={toIntendedState(redirectTo)} replace />;
  }

  if (mfaStatus === 'checking' || (isWaitingForAccount && !waitedTooLong)) {
    return mountedAsGuest ? children : <SaysoLoader />;
  }

  if (holdOnAccountNotFound && mountedAsGuest && accountNotFound) {
    return children;
  }

  // Mirrors AuthGuard: authentication is the Supabase session, not whether the
  // account fetch succeeded. Keying this on globalUser showed the login form to
  // users who were already signed in but whose account failed to load, offering
  // them a sign-in that could only fail the same way (SAYSO-342).
  return <Navigate to={redirectTo} replace />;
};

export default GuestGuard;
