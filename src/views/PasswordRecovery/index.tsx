import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './styles.css';
import LoginLayout from '@/components/layouts/LoginLayout';
import { useForm } from 'react-hook-form';
import ControlledInputField from '@/components/forms/ControlledInputField';
import SaysoButton from '@/components/SaysoButton';
import { useMutation } from '@tanstack/react-query';
import { PasswordRecoveryFormData } from '../Login/types';
import sendPasswordRecoveryEmail from './services/sendPasswordRecoveryEmail';

const PasswordRecovery = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(0);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const { control, handleSubmit, setError, reset } = useForm<PasswordRecoveryFormData>({
    defaultValues: {
      email: ''
    }
  });
  
  const {mutate: resetPasswordMutation, isPending: isResetPasswordPending} = useMutation({
    mutationFn: sendPasswordRecoveryEmail,
    mutationKey: ['send-password-recovery-email'],
    onSuccess: ({ message }) => {
      reset();
      setSuccessMessage(message);
      setCountdown(60);
    },
    onError: (error) => {
      setError('email', { 
        message: error.message || 'Failed to send reset link, try again later or contact support.' 
      });
    }
  });

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const onSubmit = async (data: PasswordRecoveryFormData) => {
    if (!data.email) {
      setError('email', { message: 'Email is required' });
      return;
    }
    resetPasswordMutation(data.email);
  };

  const handleGoBackToLogin = () => {
    if (isResetPasswordPending) return;
    navigate('/login');
  };

  return (
    <LoginLayout title="Reset Your Password" description={"Enter your email address and we'll send you a link to reset your password."}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ marginBottom: '20px' }}>
              <ControlledInputField type="email" name="email" label="Email Address" control={control} labelCn='password-recovery-input-label'/>
          </div>
          <SaysoButton 
            label="Send Reset Link" 
            type="submit" 
            onClick={handleSubmit(onSubmit)} 
            loading={isResetPasswordPending}
            disabled={countdown > 0 || isResetPasswordPending}
            fullWidth
          />
          {successMessage && countdown > 0 && (
            <div className="password-recovery-success">
              <p>{successMessage} If not, please contact <a href="mailto:support@asksayso.com">support@asksayso.com</a>.</p>
            </div>
          )}
          {countdown > 0 && (
            <p className="password-recovery-countdown">
              You can request again in {countdown} second{countdown !== 1 ? 's' : ''}
            </p>
          )}
        </form>
        <p 
          className="toggleText"
          onClick={handleGoBackToLogin}
        >
          Back to Sign In
        </p>
      </LoginLayout>
  );
};

export default PasswordRecovery;

