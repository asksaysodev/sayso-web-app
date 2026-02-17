import { useState } from 'react';
import { LuCopy, LuCheck, LuLoader } from 'react-icons/lu';
import { EnrollTOTPResult, MFAServiceError } from '@/types/supabaseMFA';
import { verifyTOTPCode } from '@/services/mfaServices';
import '../styles.css';

type Step = 'qr' | 'verify';

interface Props {
    enrollmentData: EnrollTOTPResult;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function MFAEnrollmentModal({ enrollmentData, onSuccess, onCancel }: Props) {
    const [step, setStep] = useState<Step>('qr');
    const [code, setCode] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopySecret = async () => {
        await navigator.clipboard.writeText(enrollmentData.secret);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
        setCode(value);
        setError(null);
    };

    const handleVerify = async () => {
        if (code.length !== 6) {
            setError('Please enter a 6-digit code');
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

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && step === 'verify' && code.length === 6) {
            handleVerify();
        }
    };

    return (
        <div className="mfa-modal-overlay">
            <div className="mfa-modal">
                <div className="mfa-modal-header">
                    <h2>Set up Two-Factor Authentication</h2>
                    <p className="mfa-modal-subtitle">
                        {step === 'qr'
                            ? 'Scan the QR code with your authenticator app'
                            : 'Enter the 6-digit code from your app'
                        }
                    </p>
                </div>

                <div className="mfa-modal-content">
                    {step === 'qr' ? (
                        <>
                            <div className="mfa-qr-container">
                                <img
                                    src={enrollmentData.qrCode}
                                    alt="QR Code for authenticator app"
                                    className="mfa-qr-code"
                                />
                            </div>

                            <div className="mfa-secret-container">
                                <p className="mfa-secret-label">Can't scan? Enter this code manually:</p>
                                <div className="mfa-secret-box">
                                    <code className="mfa-secret-code">{enrollmentData.secret}</code>
                                    <button
                                        type="button"
                                        onClick={handleCopySecret}
                                        className="mfa-copy-btn"
                                        title="Copy to clipboard"
                                    >
                                        {copied ? <LuCheck size={16} /> : <LuCopy size={16} />}
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="mfa-verify-container">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    autoComplete="one-time-code"
                                    value={code}
                                    onChange={handleCodeChange}
                                    onKeyDown={handleKeyDown}
                                    placeholder="000000"
                                    className={`mfa-code-input ${error ? 'mfa-code-input-error' : ''}`}
                                    maxLength={6}
                                    autoFocus
                                    disabled={isVerifying}
                                />
                                {error && <p className="mfa-error">{error}</p>}
                            </div>
                        </>
                    )}
                </div>

                <div className="mfa-modal-actions">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="mfa-btn mfa-btn-secondary"
                        disabled={isVerifying}
                    >
                        Cancel
                    </button>

                    {step === 'qr' ? (
                        <button
                            type="button"
                            onClick={() => setStep('verify')}
                            className="mfa-btn mfa-btn-primary"
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleVerify}
                            className="mfa-btn mfa-btn-primary"
                            disabled={code.length !== 6 || isVerifying}
                        >
                            {isVerifying ? (
                                <>
                                    <LuLoader className="mfa-spinner" size={16} />
                                    Verifying...
                                </>
                            ) : (
                                'Verify'
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
