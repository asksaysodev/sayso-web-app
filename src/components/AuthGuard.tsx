import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import SaysoLoader from './SaysoLoader';

import { useAuth } from '../context/AuthContext';
import { getAAL } from '@/services/mfaServices';

import '../styles/AuthGuard.css';

interface Props {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: Props) => {
  const { globalUser, loading = true, userLoading, checkIfNeedsMFA } = useAuth();
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

  if (loading || userLoading || isCheckingMFA) {
    return <SaysoLoader />;
  }

  if (!globalUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default AuthGuard; 