import { useState, type ChangeEvent, type FormEvent } from 'react';
import { ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ds/Button';
import { CopyBox } from '@/components/ds/CopyBox';
import { Modal, ModalBody, ModalFooter, ModalHeader } from '@/components/ds/Modal';
import { TextField } from '@/components/ds/TextField';
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

    const handleCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
        setCode(event.target.value.replace(/\D/g, '').slice(0, CODE_LENGTH));
        setError(null);
    };

    const handleVerify = async (event?: FormEvent) => {
        event?.preventDefault();
        if (code.length !== CODE_LENGTH) {
            setError(`Please enter a ${CODE_LENGTH}-digit code`);
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
        }
    };

    const handleOpenChange = (open: boolean) => {
        if (!open && !isVerifying) onCancel();
    };

    return (
        <Modal open onOpenChange={handleOpenChange} hideClose={isVerifying} className='mfa-enroll-modal'>
            <ModalHeader
                icon={<ShieldCheck size={24} />}
                title='Set up two-factor authentication'
                description={
                    step === 'qr'
                        ? 'Scan the QR code with your authenticator app.'
                        : `Enter the ${CODE_LENGTH}-digit code from your authenticator app.`
                }
            />

            <ModalBody>
                <p className='mfa-enroll-modal__step'>Step {step === 'qr' ? 1 : 2} of 2</p>
                {step === 'qr' ? (
                    <>
                        <div className='mfa-enroll-modal__qr'>
                            <img src={enrollmentData.qrCode} alt='QR code for your authenticator app' />
                        </div>
                        <div className='mfa-enroll-modal__manual'>
                            <p className='mfa-enroll-modal__label'>Can't scan? Enter this code manually</p>
                            <CopyBox
                                value={enrollmentData.secret}
                                monospace
                                onCopyError={() => showToast('error', "Couldn't copy the code. Select it and copy manually.")}
                            />
                        </div>
                    </>
                ) : (
                    <form id={VERIFY_FORM_ID} onSubmit={handleVerify}>
                        <TextField
                            label='Verification code'
                            className='mfa-enroll-modal__code'
                            inputMode='numeric'
                            autoComplete='one-time-code'
                            placeholder='000000'
                            value={code}
                            onChange={handleCodeChange}
                            maxLength={CODE_LENGTH}
                            autoFocus
                            disabled={isVerifying}
                            error={error ?? undefined}
                        />
                    </form>
                )}
            </ModalBody>

            <ModalFooter>
                <Button variant='secondary' onClick={onCancel} disabled={isVerifying}>
                    Cancel
                </Button>
                {step === 'qr' ? (
                    <Button onClick={() => setStep('verify')}>Next</Button>
                ) : (
                    <Button
                        type='submit'
                        form={VERIFY_FORM_ID}
                        disabled={code.length !== CODE_LENGTH}
                        loading={isVerifying}
                    >
                        Verify
                    </Button>
                )}
            </ModalFooter>
        </Modal>
    );
}
