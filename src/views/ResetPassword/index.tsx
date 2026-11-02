import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Check, CircleAlert, Eye, EyeOff, Link2Off, LoaderCircle } from 'lucide-react';
import * as Sentry from '@sentry/react';

import { supabase } from '@/config/supabase';
import { useToast } from '@/context/ToastContext';
import AuthLayout from '@/components/layouts/AuthLayout';
import { Button } from '@/components/ds/Button';
import { TextField } from '@/components/ds/TextField';
import clearRecoveryPending from './services/clearRecoveryPending';
import { PasswordStrength, getPasswordStrength } from '@/components/auth/PasswordStrength';
import './styles.css';

interface FieldErrors {
    newPassword?: string;
    confirmPassword?: string;
}

const validateFields = (newPassword: string, confirmPassword: string): FieldErrors => {
    const errors: FieldErrors = {};
    if (!newPassword) {
        errors.newPassword = 'Enter a new password.';
    } else if (!getPasswordStrength(newPassword).allRulesMet) {
        errors.newPassword =
            'This password doesn’t meet the password requirements. Choose a stronger password.';
    }
    if (!confirmPassword) {
        errors.confirmPassword = 'Confirm your password.';
    } else if (newPassword !== confirmPassword) {
        errors.confirmPassword = 'Passwords don’t match. Please try again.';
    }
    return errors;
};

interface EyeToggleProps {
    shown: boolean;
    disabled: boolean;
    label: string;
    onToggle: () => void;
}

const EyeToggle = ({ shown, disabled, label, onToggle }: EyeToggleProps) => (
    <button
        type="button"
        className="resetCardEyeToggle"
        onClick={onToggle}
        disabled={disabled}
        aria-label={shown ? `Hide ${label}` : `Show ${label}`}
        aria-pressed={shown}
    >
        {shown ? (
            <EyeOff size={24} color="var(--text-secondary)" aria-hidden="true" />
        ) : (
            <Eye size={24} color="var(--text-secondary)" aria-hidden="true" />
        )}
    </button>
);

const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { showToast } = useToast();

    const [isLoading, setIsLoading] = useState(true);
    const [linkInvalid, setLinkInvalid] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [submitted, setSubmitted] = useState(false);

    // Validate on submit, then re-validate as the user edits.
    const errors: FieldErrors = submitted ? validateFields(newPassword, confirmPassword) : {};

    useEffect(() => {
        initializeSession();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * Initialize the session with tokens from URL
     * Supabase sends access_token and refresh_token in the URL
     */
    const initializeSession = async () => {
        try {
            const accessToken = searchParams.get('access_token');
            const refreshToken = searchParams.get('refresh_token');

            if (!accessToken || !refreshToken) {
                setLinkInvalid(true);
                setIsLoading(false);
                return;
            }

            const { error: sessionError } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
            });

            if (sessionError) {
                console.error('[ResetPassword] Session error:', sessionError);
                throw sessionError;
            }

            // The link is spent the moment it verifies, so release the flag that suppresses
            // desktop handoffs while a reset is outstanding (SAYSO-433). Fire-and-forget on
            // purpose: this is a cleanup courtesy and must never block, delay or fail the
            // password reset itself. An uncleared flag just expires on its own.
            clearRecoveryPending().catch((err) => {
                console.error('[ResetPassword] Failed to clear recovery flag:', err);
                Sentry.captureException(err, { tags: { flow: 'recovery_complete' } });
            });

            setIsLoading(false);
        } catch (err) {
            console.error('[ResetPassword] Error initializing session:', err);
            setLinkInvalid(true);
            setIsLoading(false);
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (isSubmitting) return;

        setSubmitted(true);
        if (Object.keys(validateFields(newPassword, confirmPassword)).length > 0) return;

        setIsSubmitting(true);

        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password: newPassword,
            });

            if (updateError) {
                console.error('[ResetPassword] Update error:', updateError);
                throw updateError;
            }

            setSuccess(true);

            setTimeout(() => {
                navigate('/', { replace: true });
            }, 2000);
        } catch (err) {
            console.error('[ResetPassword] Error resetting password:', err);
            const message = err instanceof Error ? err.message : '';
            showToast('error', message || 'Failed to reset password. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBackToLogin = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    const backLink = (
        <Link
            to="/login"
            className="resetCardBackLink"
            onClick={(event) => {
                event.preventDefault();
                void handleBackToLogin();
            }}
        >
            <ArrowLeft size={16} aria-hidden="true" />
            Back to sign in
        </Link>
    );

    const renderCard = () => {
        if (isLoading) {
            return (
                <div className="resetCard resetCard--center" role="status" aria-label="Verifying reset link">
                    <LoaderCircle className="resetCardSpinner" size={32} color="var(--primary-500)" aria-hidden="true" />
                </div>
            );
        }

        if (linkInvalid) {
            return (
                <div className="resetCard">
                    <div className="resetCardHeader">
                        <span className="resetCardIcon resetCardIcon--warning">
                            <Link2Off size={20} color="var(--warning-icon)" aria-hidden="true" />
                        </span>
                        <h2 className="resetCardHeading">Reset link expired</h2>
                        <p className="resetCardSubtitle">
                            This password reset link has expired or is no longer valid. Request a new link to reset
                            your password.
                        </p>
                    </div>
                    <div className="resetCardFooter">
                        {backLink}
                        <Button asChild variant="primary" className="resetCardSubmit">
                            <Link to="/forgot-password">Request new link</Link>
                        </Button>
                    </div>
                </div>
            );
        }

        if (success) {
            return (
                <div className="resetCard" role="status">
                    <div className="resetCardHeader">
                        <span className="resetCardIcon resetCardIcon--success">
                            <Check size={20} color="var(--primary-500)" aria-hidden="true" />
                        </span>
                        <h2 className="resetCardHeading">Password updated</h2>
                        <p className="resetCardSubtitle">
                            Your password has been updated. You can now sign in with your new password.
                        </p>
                    </div>
                    <div className="resetCardFooter">{backLink}</div>
                </div>
            );
        }

        return (
            <form className="resetCard" onSubmit={handleSubmit} noValidate>
                <div className="resetCardHeader">
                    <h2 className="resetCardHeading">Choose your password</h2>
                    <p className="resetCardSubtitle">Enter and confirm your new password.</p>
                </div>

                <div className="resetCardFields">
                    <div className="resetCardPasswordGroup">
                        <TextField
                            label="Password"
                            type={showNewPassword ? 'text' : 'password'}
                            autoComplete="new-password"
                            value={newPassword}
                            disabled={isSubmitting}
                            error={errors.newPassword}
                            trailingIcon={
                                errors.newPassword ? (
                                    <CircleAlert size={24} color="var(--error-icon)" aria-hidden="true" />
                                ) : (
                                    <EyeToggle
                                        shown={showNewPassword}
                                        disabled={isSubmitting}
                                        label="password"
                                        onToggle={() => setShowNewPassword(prev => !prev)}
                                    />
                                )
                            }
                            onChange={(event) => setNewPassword(event.target.value)}
                        />
                        <PasswordStrength password={newPassword} />
                    </div>

                    <TextField
                        label="Repeat password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        value={confirmPassword}
                        disabled={isSubmitting}
                        error={errors.confirmPassword}
                        trailingIcon={
                            errors.confirmPassword ? (
                                <CircleAlert size={24} color="var(--error-icon)" aria-hidden="true" />
                            ) : (
                                <EyeToggle
                                    shown={showConfirmPassword}
                                    disabled={isSubmitting}
                                    label="repeat password"
                                    onToggle={() => setShowConfirmPassword(prev => !prev)}
                                />
                            )
                        }
                        onChange={(event) => setConfirmPassword(event.target.value)}
                    />
                </div>

                <div className="resetCardFooter">
                    {backLink}
                    <Button type="submit" variant="primary" className="resetCardSubmit" loading={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Reset password'}
                    </Button>
                </div>
            </form>
        );
    };

    return (
        <AuthLayout
            title="Create new password"
            headerLink={{ prompt: "Don't have an account?", label: 'Sign up', to: '/signup' }}
        >
            {renderCard()}
        </AuthLayout>
    );
};

export default ResetPassword;
