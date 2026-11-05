import { Link } from 'react-router-dom';
import { ArrowLeft, Check, Link2Off } from 'lucide-react';
import AuthLayout from '@/components/layouts/AuthLayout';
import { Button } from '@/components/ds/Button';
import { InviteErrorKind } from '../services/inviteErrors';
import '../styles.css';

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
    const { title, body, action } = COPY[kind];
    const showRetry = action === 'RETRY' && !!onRetry;
    const isAccepted = kind === 'ACCEPTED';

    return (
        <AuthLayout title="You've been invited">
            <div className="acceptInviteCard">
                <div>
                    <span
                        className={`acceptInviteCardIcon ${
                            isAccepted ? 'acceptInviteCardIcon--success' : 'acceptInviteCardIcon--warning'
                        }`}
                    >
                        {isAccepted ? (
                            <Check size={20} color="var(--primary-500)" aria-hidden="true" />
                        ) : (
                            <Link2Off size={20} color="var(--warning-icon)" aria-hidden="true" />
                        )}
                    </span>
                    <h2 className="acceptInviteCardHeading">{title}</h2>
                    <p className="acceptInviteCardSubtitle">{body}</p>
                </div>

                {action === 'SIGN_IN' && (
                    <div className="acceptInviteCardFooter">
                        <Link to="/login" className="acceptInviteCardBackLink">
                            <ArrowLeft size={16} aria-hidden="true" />
                            Back to sign in
                        </Link>
                    </div>
                )}

                {showRetry && (
                    <div className="acceptInviteCardFooter acceptInviteCardFooter--end">
                        <Button
                            type="button"
                            variant="primary"
                            className="acceptInviteCardSubmit"
                            onClick={onRetry}
                            loading={isRetrying}
                            disabled={isRetrying}
                        >
                            Try again
                        </Button>
                    </div>
                )}
            </div>
        </AuthLayout>
    );
}
