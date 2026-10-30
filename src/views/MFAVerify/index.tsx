import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, CircleAlert } from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import AuthLayout from '@/components/layouts/AuthLayout';
import { Button } from '@/components/ds/Button';
import { CodeInput, type CodeInputHandle } from '@/components/ds/CodeInput';
import './styles.css';

const CODE_LENGTH = 6;
const REDIRECT_DELAY_MS = 800;
const INVALID_CODE_MESSAGE = 'That code isn’t valid. Try the latest code from your authenticator app.';

// Supabase answers a wrong or stale TOTP with this code (message: "Invalid TOTP code entered").
const isInvalidCodeError = (error: { message?: string; code?: string } | null | undefined): boolean =>
    error?.code === 'mfa_verification_failed' || /invalid/i.test(error?.message ?? '');

const MFAVerify = () => {
    const navigate = useNavigate();
    const { verifyMFA, handleSignOut } = useAuth();
    const { showToast } = useToast();

    const [code, setCode] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const codeInput = useRef<CodeInputHandle>(null);

    // Runs after re-render, so the boxes are enabled again after a failed verify.
    useEffect(() => {
        if (!isVerifying && !isVerified) codeInput.current?.focus();
    }, [isVerifying, isVerified]);

    // Keep the success state visible briefly before the existing redirect.
    useEffect(() => {
        if (!isVerified) return;
        const timer = window.setTimeout(() => navigate('/', { replace: true }), REDIRECT_DELAY_MS);
        return () => window.clearTimeout(timer);
    }, [isVerified, navigate]);

    const handleCodeChange = (next: string) => {
        setCode(next);
        setError(null);
    };

    const handleVerify = async () => {
        if (code.length !== CODE_LENGTH || isVerifying) return;

        setIsVerifying(true);
        setError(null);

        const result = await verifyMFA(code);

        if (result.success) {
            setIsVerified(true);
            setIsVerifying(false);
        } else {
            if (isInvalidCodeError(result.error)) {
                setError(INVALID_CODE_MESSAGE);
            } else {
                showToast('error', result.error?.message || 'Something went wrong. Please try again.');
            }
            setIsVerifying(false);
        }
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        handleVerify();
    };

    const handleBackToLogin = async () => {
        await handleSignOut();
        navigate('/login', { replace: true });
    };

    if (isVerified) {
        return (
            <AuthLayout title="Two-factor authentication">
                <div className="mfaCard" role="status">
                    <span className="mfaCardSuccessIcon">
                        <Check size={20} aria-hidden="true" />
                    </span>
                    <div>
                        <h2 className="mfaCardHeading">Verification complete</h2>
                        <p className="mfaCardSubtitle">You’re signed in. Opening Sayso…</p>
                    </div>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout title="Two-factor authentication">
            <form className="mfaCard" onSubmit={handleSubmit} noValidate>
                <div>
                    <h2 className="mfaCardHeading">Verify your identity</h2>
                    <p className="mfaCardSubtitle">Enter the 6-digit code from your authenticator app.</p>
                </div>

                <div className="mfaCardBody">
                    <CodeInput
                        ref={codeInput}
                        className="mfaCardCode"
                        value={code}
                        onChange={handleCodeChange}
                        length={CODE_LENGTH}
                        disabled={isVerifying}
                        invalid={!!error}
                        autoFocus
                    />
                    {error && (
                        <p className="mfaCardError" role="alert">
                            <CircleAlert size={16} aria-hidden="true" />
                            {error}
                        </p>
                    )}
                </div>

                <div className="mfaCardFooter">
                    <button type="button" className="mfaCardBackLink" onClick={handleBackToLogin}>
                        <ArrowLeft size={16} aria-hidden="true" />
                        Back to sign in
                    </button>
                    <Button
                        type="submit"
                        variant="primary"
                        className="mfaCardSubmit"
                        loading={isVerifying}
                        disabled={code.length !== CODE_LENGTH}
                    >
                        {isVerifying ? 'Verifying...' : 'Verify'}
                    </Button>
                </div>
            </form>
        </AuthLayout>
    );
};

export default MFAVerify;
