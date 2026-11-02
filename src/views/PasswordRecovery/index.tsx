import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { ArrowLeft, CircleAlert, Clock, Mail } from 'lucide-react';

import { useToast } from '@/context/ToastContext';
import AuthLayout from '@/components/layouts/AuthLayout';
import { Button } from '@/components/ds/Button';
import { TextField } from '@/components/ds/TextField';
import sendPasswordRecoveryEmail from './services/sendPasswordRecoveryEmail';
import { formatCountdown, useResendCountdown } from './useResendCountdown';
import './styles.css';

const RESEND_SECONDS = 60;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateEmail = (value: string): string | null => {
    const trimmed = value.trim();
    if (!trimmed) return 'Enter your email address.';
    if (!EMAIL_PATTERN.test(trimmed)) return 'Enter a valid email address.';
    return null;
};

const PasswordRecovery = () => {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState<string | null>(null);
    const [sentEmail, setSentEmail] = useState<string | null>(null);
    const { showToast } = useToast();
    const countdown = useResendCountdown(RESEND_SECONDS);

    const { mutate: sendRecovery, isPending } = useMutation({
        mutationFn: sendPasswordRecoveryEmail,
        mutationKey: ['send-password-recovery-email'],
        onSuccess: (_data, sentTo) => {
            setSentEmail(sentTo);
            countdown.start();
        },
        onError: () => {
            showToast('error', 'We couldn’t send your reset link. Please try again.');
        },
    });

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (isPending || countdown.isActive) return;

        const error = validateEmail(email);
        setEmailError(error);
        if (error) return;

        sendRecovery(email.trim());
    };

    const hasSent = sentEmail !== null;
    const buttonLabel = isPending ? 'Sending...' : hasSent ? 'Resend reset link' : 'Send reset link';

    return (
        <AuthLayout
            title="Reset password"
            headerLink={{ prompt: "Don't have an account?", label: 'Sign up', to: '/signup' }}
        >
            <form className="recoveryCard" onSubmit={handleSubmit} noValidate>
                <div className="recoveryCardHeader">
                    <h2 className="recoveryCardHeading">Password recovery</h2>
                    <p className="recoveryCardSubtitle">
                        Enter your email address and we’ll send you a link to reset your password.
                    </p>
                </div>

                <div className="recoveryCardBody">
                    <TextField
                        label="Email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        disabled={isPending}
                        error={emailError ?? undefined}
                        trailingIcon={
                            emailError ? (
                                <CircleAlert size={24} color="var(--error-icon)" aria-hidden="true" />
                            ) : undefined
                        }
                        onChange={(event) => {
                            setEmail(event.target.value);
                            if (emailError) setEmailError(null);
                        }}
                    />

                    {hasSent && (
                        <>
                            <div className="recoveryCardBanner recoveryCardBanner--info" role="status">
                                <Mail size={20} color="var(--primary-500)" aria-hidden="true" />
                                <p>
                                    If an account exists for <strong>{sentEmail}</strong>, a recovery link has
                                    been sent. Check your inbox and spam folder.
                                </p>
                            </div>
                            <p className="recoveryCardCountdown">
                                <Clock size={16} aria-hidden="true" />
                                <span>
                                    {countdown.isActive
                                        ? `You can request another link in ${formatCountdown(countdown.remaining)}.`
                                        : 'You can now request another reset link.'}
                                </span>
                            </p>
                        </>
                    )}
                </div>

                <div className="recoveryCardFooter">
                    <Link to="/login" className="recoveryCardBackLink">
                        <ArrowLeft size={16} aria-hidden="true" />
                        Back to sign in
                    </Link>
                    <Button
                        type="submit"
                        variant="primary"
                        className="recoveryCardSubmit"
                        loading={isPending}
                        disabled={countdown.isActive}
                    >
                        {buttonLabel}
                    </Button>
                </div>
            </form>
        </AuthLayout>
    );
};

export default PasswordRecovery;
