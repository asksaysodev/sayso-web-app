import { useEffect, useRef, useState, type FormEvent } from 'react';
import clsx from 'clsx';
import { Button } from '@/components/ds/Button';
import { CodeInput, type CodeInputHandle } from '@/components/ds/CodeInput';
import { CopyBox } from '@/components/ds/CopyBox';
import { Modal, ModalFooter, ModalHeader } from '@/components/ds/Modal';
import { StepIndicator } from '@/components/ds/StepIndicator';
import { useToast } from '@/context/ToastContext';
import { EnrollTOTPResult } from '@/types/supabaseMFA';
import { verifyTOTPCode } from '@/services/mfaServices';
import '../styles.css';

type Step = 'qr' | 'verify';

const CODE_LENGTH = 6;
const VERIFY_FORM_ID = 'mfa-verify-form';

interface Props {
    enrollmentData: EnrollTOTPResult;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function MFAEnrollmentModal({ enrollmentData, onSuccess, onCancel }: Props) {
    const { showToast } = useToast();
    const [step, setStep] = useState<Step>('qr');
    const [code, setCode] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const codeInput = useRef<CodeInputHandle>(null);

    useEffect(() => {
        if (step === 'verify') codeInput.current?.focus();
    }, [step]);

    const handleCodeChange = (next: string) => {
        setCode(next);
        setError(null);
    };

    const handleVerify = async (event: FormEvent) => {
        event.preventDefault();
        if (code.length !== CODE_LENGTH) {
            setError(`Please enter the ${CODE_LENGTH}-digit code`);
            return;
        }

        setIsVerifying(true);
        setError(null);
        const result = await verifyTOTPCode(enrollmentData.factorId, code);
        setIsVerifying(false);

        if (result.success) {
            onSuccess();
        } else {
            setError(result.error?.message || 'Invalid code. Please try again.');
            setCode('');
            codeInput.current?.focus();
        }
    };

    const handleOpenChange = (open: boolean) => {
        if (!open && !isVerifying) onCancel();
    };

    return (
        <Modal open onOpenChange={handleOpenChange} hideClose={isVerifying} className='mfa-enroll-modal'>
            <ModalHeader
                title='Set up two-factor authentication'
                description={
                    step === 'qr'
                        ? 'Scan the QR code with your authenticator app.'
                        : `Enter the ${CODE_LENGTH}-digit code from your authenticator app.`
                }
            />
            <StepIndicator count={2} current={step === 'qr' ? 1 : 2} />

            {/* Both steps share one grid cell, so the modal keeps the same size and everything stays put. */}
            <div className='mfa-enroll-modal__steps'>
                <div className={clsx('mfa-enroll-modal__step', step !== 'qr' && 'mfa-enroll-modal__step--hidden')}>
                    <img className='mfa-enroll-modal__qr' src={enrollmentData.qrCode} alt='QR code for your authenticator app' />
                    <div className='mfa-enroll-modal__manual'>
                        <p className='mfa-enroll-modal__label'>Can't scan? Enter this code manually</p>
                        <CopyBox
                            value={enrollmentData.secret}
                            monospace
                            tone='neutral'
                            onCopyError={() => showToast('error', "Couldn't copy the code. Select it and copy manually.")}
                        />
                    </div>
                </div>
                <form
                    id={VERIFY_FORM_ID}
                    className={clsx('mfa-enroll-modal__step', step !== 'verify' && 'mfa-enroll-modal__step--hidden')}
                    onSubmit={handleVerify}
                >
                    <CodeInput
                        ref={codeInput}
                        value={code}
                        onChange={handleCodeChange}
                        length={CODE_LENGTH}
                        disabled={isVerifying}
                        invalid={!!error}
                    />
                    <p className='mfa-enroll-modal__error' role='alert'>
                        {error}
                    </p>
                </form>
            </div>

            <ModalFooter>
                <Button variant='secondary' onClick={onCancel} disabled={isVerifying}>
                    Cancel
                </Button>
                {step === 'qr' ? (
                    <Button onClick={() => setStep('verify')}>Next</Button>
                ) : (
                    // Linked via `form`, so it's the form's default button: Enter in a box submits.
                    <Button type='submit' form={VERIFY_FORM_ID} disabled={code.length !== CODE_LENGTH} loading={isVerifying}>
                        Verify
                    </Button>
                )}
            </ModalFooter>
        </Modal>
    );
}
