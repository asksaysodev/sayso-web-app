import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import LoginLayout from '@/components/layouts/LoginLayout';
import SaysoButton from '@/components/SaysoButton';
import './styles.css';

const MFAVerify = () => {
    const navigate = useNavigate();
    const { verifyMFA, handleSignOut } = useAuth();

    const [code, setCode] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isVerifying, setIsVerifying] = useState(false);

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

        const result = await verifyMFA(code);

        if (result.success) {
            navigate('/', { replace: true });
        } else {
            setError(result.error?.message || 'Invalid code. Please try again.');
            setCode('');
            setIsVerifying(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && code.length === 6 && !isVerifying) {
            handleVerify();
        }
    };

    const handleBackToLogin = async () => {
        await handleSignOut();
        navigate('/login', { replace: true });
    };

    return (
        <LoginLayout
            title="Two-Factor Authentication"
            description="Enter the 6-digit code from your authenticator app"
            error={error}
        >
            <div className="mfa-verify-container">
                <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={code}
                    onChange={handleCodeChange}
                    onKeyDown={handleKeyDown}
                    placeholder="000000"
                    className="mfa-verify-input"
                    maxLength={6}
                    autoFocus
                    disabled={isVerifying}
                />

                <SaysoButton
                    label="Verify"
                    onClick={handleVerify}
                    loading={isVerifying}
                    disabled={code.length !== 6 || isVerifying}
                    fullWidth
                />
            </div>

            <p className="toggleText" onClick={handleBackToLogin}>
                Back to Sign In
            </p>
        </LoginLayout>
    );
};

export default MFAVerify;
