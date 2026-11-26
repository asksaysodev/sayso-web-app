import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export const SIGN_OUT_FAILED_MESSAGE = "We couldn't sign you out. Check your connection and try again.";

/**
 * Signs out and tells the user when it fails. `signOut` resolves to whether the session ended,
 * so callers navigate only on success: `if (await signOut()) navigate('/login')`.
 * handleSignOut already reports the failure to Sentry.
 */
export default function useSignOut({ toastOnError = true }: { toastOnError?: boolean } = {}) {
    const { handleSignOut } = useAuth();
    const { showToast } = useToast();
    const [isSigningOut, setIsSigningOut] = useState(false);

    const signOut = async (): Promise<boolean> => {
        setIsSigningOut(true);
        try {
            await handleSignOut();
            return true;
        } catch {
            if (toastOnError) showToast('error', SIGN_OUT_FAILED_MESSAGE);
            return false;
        } finally {
            setIsSigningOut(false);
        }
    };

    return { signOut, isSigningOut };
}
