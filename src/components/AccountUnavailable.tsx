import SaysoButton from './SaysoButton';
import '../styles/AccountUnavailable.css';

import saysoLogo from '/assets/sayso.svg';

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
            <div className="account-unavailable-card">
                <img className="account-unavailable-logo" src={saysoLogo} alt="Sayso" />
                <h1 className="account-unavailable-title">We couldn't load your account</h1>
                <p className="account-unavailable-body">
                    You're still signed in — we just couldn't reach your account details.
                    This is usually temporary.
                </p>
                <SaysoButton label="Try again" onClick={onRetry} fullWidth />
            </div>
        </div>
    );
}
