import { useAuth } from '@/context/AuthContext';
import React from 'react';
import { Navigate } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
}

const GuestGuard = ({ children }: Props) => {
  const { globalUser, loading, userLoading } = useAuth();

  if (loading || userLoading) {
    return null; // Optionally, return a loader here
  }

  if (globalUser) {
    // If already authenticated, redirect to dashboard
    return <Navigate to="/" replace />;
  }

  return children;
};

export default GuestGuard; 