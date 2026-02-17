import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SaysoLoader from './SaysoLoader';

interface Props {
    children: React.ReactNode;
}

/**
 * Guard for MFA verification route.
 * - If no user session → redirect to /login
 * - If user exists but MFA not required → redirect to /
 * - If user exists and MFA required → render children
 */
const MFAGuard = ({ children }: Props) => {
    const { user, loading, checkMFAStatus } = useAuth();
    const [isChecking, setIsChecking] = useState(true);
    const [needsMFA, setNeedsMFA] = useState(false);

    useEffect(() => {
        const verifyMFAStatus = async () => {
            if (!user) {
                setIsChecking(false);
                return;
            }

            const mfaRequired = await checkMFAStatus();
            setNeedsMFA(mfaRequired);
            setIsChecking(false);
        };

        if (!loading) {
            verifyMFAStatus();
        }
    }, [user, loading, checkMFAStatus]);

    if (loading || isChecking) {
        return <SaysoLoader />;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!needsMFA) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default MFAGuard;
