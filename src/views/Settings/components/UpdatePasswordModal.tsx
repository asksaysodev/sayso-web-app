import { useEffect, useRef, useState, type FormEvent } from 'react';
import { CircleAlert } from 'lucide-react';
import * as Sentry from '@sentry/react';
import { Button } from '@/components/ds/Button';
import { CodeInput, type CodeInputHandle } from '@/components/ds/CodeInput';
import { Modal, ModalFooter, ModalHeader } from '@/components/ds/Modal';
import { StepIndicator } from '@/components/ds/StepIndicator';
import { TextField } from '@/components/ds/TextField';
import { PasswordStrength } from '@/components/auth/PasswordStrength';
import { PasswordVisibilityToggle } from '@/components/auth/PasswordVisibilityToggle';
import { validateFields } from '@/components/auth/passwordValidation';
import { useToast } from '@/context/ToastContext';
import { changePassword } from '@/services/changePassword';
import { listFactors, verifyTOTPCode } from '@/services/mfaServices';
import './UpdatePasswordModal.css';

type Step = 'password' | 'code';

const CODE_LENGTH = 6;
const FORM_ID = 'update-password-form';
// The server requires a 2FA verification within 5 minutes; reuse one only while it is comfortably fresh.
const MFA_FRESH_MS = 4 * 60 * 1000;
const GENERIC_ERROR = 'Something went wrong. Please try again.';
const INVALID_CODE_MESSAGE = 'That code is incorrect. Try again.';

// Supabase answers a wrong or stale TOTP with this code (message: "Invalid TOTP code entered").
const isInvalidCodeError = (error: { message?: string; code?: string } | null | undefined): boolean =>
    error?.code === 'mfa_verification_failed' || /invalid/i.test(error?.message ?? '');

interface Props {
    onClose: () => void;
}

export default function UpdatePasswordModal({ onClose }: Props) {
    const { showToast } = useToast();

    const [step, setStep] = useState<Step>('password');
    const [factorId, setFactorId] = useState<string | null>(null);
    const [factorsLoading, setFactorsLoading] = useState(true);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const [code, setCode] = useState('');
    const [codeError, setCodeError] = useState<string | null>(null);
    const [codeNote, setCodeNote] = useState<string | null>(null);
    const [currentPasswordError, setCurrentPasswordError] = useState<string | null>(null);
    const [newPasswordError, setNewPasswordError] = useState<string | null>(null);
    const [generalError, setGeneralError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const verifiedAt = useRef<number | null>(null);
    const codeInput = useRef<CodeInputHandle>(null);

    const hasTwoFactor = factorId !== null;

    useEffect(() => {
        let cancelled = false;
        listFactors().then(({ data }) => {
            if (cancelled) return;
            setFactorId(data.length > 0 ? data[0].id : null);
            setFactorsLoading(false);
        });
        return () => {
            cancelled = true;
        };
    }, []);

    // Runs after re-render, so the boxes are enabled again: on reaching step 2 and after a failed verify.
    useEffect(() => {
        if (step === 'code' && !isSubmitting) codeInput.current?.focus();
    }, [step, isSubmitting, codeError]);

    const fieldErrors = submitted ? validateFields(newPassword, confirmPassword) : {};
    const currentError =
        currentPasswordError ?? (submitted && !currentPassword ? 'Enter your current password.' : undefined);
    const newError = fieldErrors.newPassword ?? newPasswordError ?? undefined;

    const submitPassword = async () => {
        setIsSubmitting(true);
        setGeneralError(null);
        const result = await changePassword(currentPassword, newPassword);
        setIsSubmitting(false);

        if (result.success) {
            showToast('success', 'Password updated.');
            onClose();
            return;
        }

        switch (result.code) {
            case 'invalid_current_password':
                setCurrentPasswordError(result.message || 'Your current password is incorrect.');
                setStep('password');
                break;
            case 'same_password':
            case 'weak_password':
                setNewPasswordError(result.message || GENERIC_ERROR);
                setStep('password');
                break;
            case 'mfa_required':
                verifiedAt.current = null;
                if (factorId) {
                    setCode('');
                    setCodeError(null);
                    setCodeNote('For your security, enter a new code from your authenticator app.');
                    setStep('code');
                } else {
                    setGeneralError(GENERIC_ERROR);
                }
                break;
            case 'rate_limited':
                setGeneralError(result.message || GENERIC_ERROR);
                break;
            default:
                Sentry.captureException(new Error(`change-password failed: ${result.code}`), {
                    extra: { status: result.status },
                });
                setGeneralError(GENERIC_ERROR);
        }
    };

    const handlePasswordSubmit = async (event: FormEvent) => {
        event.preventDefault();
        if (isSubmitting || factorsLoading) return;

        setSubmitted(true);
        if (!currentPassword || Object.keys(validateFields(newPassword, confirmPassword)).length > 0) return;

        setGeneralError(null);
        if (!hasTwoFactor) {
            await submitPassword();
            return;
        }
        const fresh = verifiedAt.current !== null && Date.now() - verifiedAt.current < MFA_FRESH_MS;
        if (fresh) {
            await submitPassword();
            return;
        }
        setCode('');
        setCodeError(null);
        setCodeNote(null);
        setStep('code');
    };

    const handleCodeSubmit = async (event: FormEvent) => {
        event.preventDefault();
        if (isSubmitting || !factorId) return;
        if (code.length !== CODE_LENGTH) {
            setCodeError(`Please enter the ${CODE_LENGTH}-digit code`);
            return;
        }

        setIsSubmitting(true);
        setCodeError(null);
        setGeneralError(null);
        const verification = await verifyTOTPCode(factorId, code);

        if (!verification.success) {
            setIsSubmitting(false);
            setCode('');
            if (isInvalidCodeError(verification.error)) {
                setCodeError(INVALID_CODE_MESSAGE);
            } else {
                setCodeError(GENERIC_ERROR);
            }
            return;
        }

        verifiedAt.current = Date.now();
        setCodeNote(null);
        await submitPassword();
    };

    const handleOpenChange = (open: boolean) => {
        if (!open && !isSubmitting) onClose();
    };

    const errorIcon = <CircleAlert size={24} color='var(--error-icon)' aria-hidden='true' />;
    const onCodeStep = step === 'code';

    return (
        <Modal open onOpenChange={handleOpenChange} hideClose={isSubmitting} className='update-password-modal'>
            <ModalHeader
                title='Update password'
                description={
                    onCodeStep
                        ? `Enter the ${CODE_LENGTH}-digit code from your authenticator app.`
                        : 'Enter your current password, then choose a new one.'
                }
            />
            {hasTwoFactor && <StepIndicator count={2} current={onCodeStep ? 2 : 1} />}

            {!onCodeStep ? (
                <form id={FORM_ID} className='update-password-modal__form' onSubmit={handlePasswordSubmit} noValidate>
                    <div className='update-password-modal__fields'>
                        <div>
                            <TextField
                                label='Current password'
                                type={showCurrent ? 'text' : 'password'}
                                autoComplete='current-password'
                                value={currentPassword}
                                disabled={isSubmitting}
                                error={currentError}
                                trailingIcon={
                                    currentError ? (
                                        errorIcon
                                    ) : (
                                        <PasswordVisibilityToggle
                                            shown={showCurrent}
                                            disabled={isSubmitting}
                                            label='current password'
                                            onToggle={() => setShowCurrent((prev) => !prev)}
                                        />
                                    )
                                }
                                onChange={(event) => {
                                    setCurrentPassword(event.target.value);
                                    setCurrentPasswordError(null);
                                }}
                            />
                        </div>

                        <div className='update-password-modal__group'>
                            <TextField
                                label='New password'
                                type={showNew ? 'text' : 'password'}
                                autoComplete='new-password'
                                value={newPassword}
                                disabled={isSubmitting}
                                error={newError}
                                trailingIcon={
                                    newError ? (
                                        errorIcon
                                    ) : (
                                        <PasswordVisibilityToggle
                                            shown={showNew}
                                            disabled={isSubmitting}
                                            label='new password'
                                            onToggle={() => setShowNew((prev) => !prev)}
                                        />
                                    )
                                }
                                onChange={(event) => {
                                    setNewPassword(event.target.value);
                                    setNewPasswordError(null);
                                }}
                            />
                            <PasswordStrength password={newPassword} />
                        </div>

                        <TextField
                            label='Repeat new password'
                            type={showConfirm ? 'text' : 'password'}
                            autoComplete='new-password'
                            value={confirmPassword}
                            disabled={isSubmitting}
                            error={fieldErrors.confirmPassword}
                            trailingIcon={
                                fieldErrors.confirmPassword ? (
                                    errorIcon
                                ) : (
                                    <PasswordVisibilityToggle
                                        shown={showConfirm}
                                        disabled={isSubmitting}
                                        label='repeat new password'
                                        onToggle={() => setShowConfirm((prev) => !prev)}
                                    />
                                )
                            }
                            onChange={(event) => setConfirmPassword(event.target.value)}
                        />
                    </div>
                    <p className='update-password-modal__error' role='alert'>
                        {generalError}
                    </p>
                </form>
            ) : (
                <form id={FORM_ID} className='update-password-modal__form update-password-modal__code' onSubmit={handleCodeSubmit}>
                    {codeNote && <p className='update-password-modal__note'>{codeNote}</p>}
                    <CodeInput
                        ref={codeInput}
                        value={code}
                        onChange={(next) => {
                            setCode(next);
                            setCodeError(null);
                        }}
                        length={CODE_LENGTH}
                        disabled={isSubmitting}
                        invalid={!!codeError}
                    />
                    <p className='update-password-modal__error update-password-modal__error--center' role='alert'>
                        {codeError ?? generalError}
                    </p>
                </form>
            )}

            <ModalFooter>
                {onCodeStep ? (
                    <Button variant='secondary' onClick={() => setStep('password')} disabled={isSubmitting}>
                        Back
                    </Button>
                ) : (
                    <Button variant='secondary' onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                )}
                {/* Linked via `form`, so it's the form's default button: Enter submits. */}
                <Button
                    type='submit'
                    form={FORM_ID}
                    loading={isSubmitting}
                    disabled={factorsLoading || (onCodeStep && code.length !== CODE_LENGTH)}
                >
                    {hasTwoFactor && !onCodeStep ? 'Continue' : 'Update password'}
                </Button>
            </ModalFooter>
        </Modal>
    );
}
