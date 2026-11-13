import { LuX } from 'react-icons/lu';
import { Button } from '@/components/ds/Button';
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
 */
export default function AccountUnavailable({ onRetry }: Props) {
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
                <Button className="account-unavailable-retry" onClick={onRetry}>
                    Try again
                </Button>
            </div>
        </div>
    );
}
