import { useNavigate } from 'react-router-dom';
import LoginLayout from '@/components/layouts/LoginLayout';
import SaysoButton from '@/components/SaysoButton';
import { InviteErrorKind } from '../services/inviteErrors';

interface Props {
    kind: InviteErrorKind;
    onRetry?: () => void;
    isRetrying?: boolean;
}

interface Copy {
    title: string;
    body: string;
    action?: 'SIGN_IN' | 'RETRY';
}

const COPY: Record<InviteErrorKind, Copy> = {
    ACCEPTED: {
        title: 'This invite has already been accepted',
        body: 'Your account is ready — sign in to get started.',
        action: 'SIGN_IN',
    },
    EXPIRED: {
        title: 'This invite has expired',
        body: 'Please contact your Company administrator to get a new invite.',
    },
    REVOKED: {
        title: 'This invite has been revoked',
        body: 'Please contact your Company administrator to get a new invite.',
    },
    INVALID: {
        title: "This invite link isn't valid",
        body: "Check that you opened the full link from your invite email. If it still doesn't work, contact your Company administrator.",
    },
    RATE_LIMITED: {
        title: 'Too many attempts',
        body: 'Please wait a minute, then try again.',
        action: 'RETRY',
    },
    TRANSIENT: {
        title: "We couldn't check this invite",
        body: 'Something went wrong on our end. This is usually temporary.',
        action: 'RETRY',
    },
};

export default function InviteUnavailable({ kind, onRetry, isRetrying = false }: Props) {
    const navigate = useNavigate();
    const { title, body, action } = COPY[kind];

    return (
        <LoginLayout title={title}>
            <div className="accept-invite-invalid">
                <p>{body}</p>
            </div>

            {action === 'SIGN_IN' && (
                <div className="accept-invite-error-actions">
                    <SaysoButton label="Go to sign in" onClick={() => navigate('/login')} fullWidth />
                </div>
            )}

            {action === 'RETRY' && onRetry && (
                <div className="accept-invite-error-actions">
                    <SaysoButton
                        label="Try again"
                        onClick={onRetry}
                        loading={isRetrying}
                        disabled={isRetrying}
                        fullWidth
                    />
                </div>
            )}
        </LoginLayout>
    );
}
