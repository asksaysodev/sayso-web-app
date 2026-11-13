import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { LuX } from 'react-icons/lu';
import { Button } from '@/components/ds/Button';
import { useAuth } from '@/context/AuthContext';
import '../styles/AccountUnavailable.css';

interface Props {
    onRetry: () => void;
}

/**
 * Shown when the Supabase session is valid but the account could not be loaded
 * and no cached copy was available.
 *
 * This case used to fall through to a redirect to /login, which told the user
 * they were signed out when they were not, and offered them a sign-in that
 * could only fail the same way (SAYSO-342).
 *
 * Sign out is the way out when retrying keeps failing (e.g. the account itself
 * is broken, not just unreachable), since this screen has no nav.
 */
export default function AccountUnavailable({ onRetry }: Props) {
    const { handleSignOut } = useAuth();
    const navigate = useNavigate();
    const [isSigningOut, setIsSigningOut] = useState(false);

    const onSignOut = async () => {
        setIsSigningOut(true);
        try {
            await handleSignOut();
            navigate('/login', { replace: true });
        } finally {
            setIsSigningOut(false);
        }
    };

    return (
        <div className="account-unavailable-container">
            <div className="account-unavailable-content" role="alert">
                <span className="account-unavailable-icon" aria-hidden="true">
                    <LuX size={24} />
                </span>
                <h1 className="account-unavailable-title">We couldn't load your account</h1>
                <p className="account-unavailable-body">
                    You're still signed in — we just couldn't reach your account details.
                    This is usually temporary.
                </p>
                <div className="account-unavailable-actions">
                    <Button
                        variant="secondary"
                        leftIcon={<LogOut size={16} aria-hidden="true" />}
                        loading={isSigningOut}
                        onClick={onSignOut}
                    >
                        Sign out
                    </Button>
                    <Button onClick={onRetry} disabled={isSigningOut}>
                        Try again
                    </Button>
                </div>
            </div>
        </div>
    );
}
