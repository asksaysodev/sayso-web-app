import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './styles.css';
import LoginLayout from '@/components/layouts/LoginLayout';
import { useForm } from 'react-hook-form';
import ControlledInputField from '@/components/forms/ControlledInputField';
import { supabase } from '@/config/supabase';
import SaysoButton from '@/components/SaysoButton';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/context/ToastContext';
import { PasswordRecoveryFormData } from '../Login/types';

const PasswordRecovery = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [countdown, setCountdown] = useState(0);
  
  const { control, handleSubmit, setError, reset } = useForm<PasswordRecoveryFormData>({
    defaultValues: {
      email: ''
    }
  });
  
  const {mutate: resetPasswordMutation, isPending: isResetPasswordPending} = useMutation({
    mutationFn: async (email: string) => {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: process.env.NODE_ENV === 'development' 
          ? 'http://localhost:5173' 
          : 'sayso://'
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      showToast('success', 'Reset link sent! Check your email');
      reset();
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

