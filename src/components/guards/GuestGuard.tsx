import { useAuth } from '@/context/AuthContext';
import React from 'react';
import { Navigate } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
  /**
   * Where a signed-in user goes. /signup passes '/signup/plan' so the session that
   * sign-up itself creates continues the flow instead of racing to the dashboard.
   */
  redirectTo?: string;
}

const GuestGuard = ({ children, redirectTo = '/' }: Props) => {
  const { user, loading, userLoading } = useAuth();

  if (loading || userLoading) {
    return null; // Optionally, return a loader here
  }

  // Mirrors AuthGuard: authentication is the Supabase session, not whether the
  // account fetch succeeded. Keying this on globalUser showed the login form to
  // users who were already signed in but whose account failed to load, offering
  // them a sign-in that could only fail the same way (SAYSO-342).
  if (user) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default GuestGuard; 