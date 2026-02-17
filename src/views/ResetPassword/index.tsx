import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/config/supabase';
import { validateResetPasswordFields } from '@/views/Login/helpers/formValidation';

import './styles.css';
import LoginLayout from '@/components/layouts/LoginLayout';
import SaysoButton from '@/components/SaysoButton';
import { useForm, FieldErrors } from 'react-hook-form';
import ControlledInputField from '@/components/forms/ControlledInputField';
import EyeToggleShowPasswordButton from '../Login/components/EyeToggleShowPasswordButton';
import { ResetPasswordFormData } from '../Login/types';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const customResolver = (values: ResetPasswordFormData) => {
    const errors = validateResetPasswordFields(values);
    
    return {
      values: Object.keys(errors).length === 0 ? values : {},
      errors: Object.keys(errors).reduce<FieldErrors<ResetPasswordFormData>>((acc, key) => {
        acc[key as keyof ResetPasswordFormData] = { type: 'validation', message: errors[key as keyof typeof errors] };
        return acc;
      }, {})
    };
  };
  
  const { control, handleSubmit, setError, reset, formState: { errors } } = useForm<ResetPasswordFormData>({
    resolver: customResolver,
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    defaultValues: {
      newPassword: '',
      confirmPassword: ''
    }
  })

  useEffect(() => {
    initializeSession();
  }, []);

  /**
   * Initialize the session with tokens from URL
   * Supabase sends access_token and refresh_token in the URL
   */
  const initializeSession = async () => {
    try {
      const accessToken = searchParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token');
      const type = searchParams.get('type');

      console.log('[ResetPassword] Initializing session with tokens:', { 
        hasAccessToken: !!accessToken, 
        hasRefreshToken: !!refreshToken, 
        type 
      });

      if (!accessToken || !refreshToken) {
        setError('root', { type: 'manual', message: 'Invalid or expired reset link. Please request a new one.' });
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

      console.log('[ResetPassword] Session established successfully');
      setIsLoading(false);
    } catch (err) {
      console.error('[ResetPassword] Error initializing session:', err);
      setError('root', { type: 'manual', message: 'Failed to verify reset link. Please request a new one.' });
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsSubmitting(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: data.newPassword,
      });

      if (updateError) {
        console.error('[ResetPassword] Update error:', updateError);
        throw updateError;
      }

      console.log('[ResetPassword] Password updated successfully');
      setSuccess(true);

      setTimeout(() => {
        navigate('/', { replace: true });
      }, 2000);
    } catch (err: any) {
      console.error('[ResetPassword] Error resetting password:', err);
      setError('root', { type: 'manual', message: err.message || 'Failed to reset password. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToLogin = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (isLoading) {
    return (
      <LoginLayout>
          <div style={{ fontSize: '14px', color: '#64748b', textAlign: 'center' }}>Verifying reset link...</div>
      </LoginLayout>
    );
  }

  if (errors.root?.message) {
    return (
      <LoginLayout error={errors.root?.message ?? 'Failed to verify reset link. Please request a new one.'}>
        <SaysoButton label='Go back to request new Reset Password Link' onClick={() => navigate('/forgot-password')} fullWidth />
      </LoginLayout>
    );
  }

  if (success) {
    return (
      <LoginLayout title={'Password Reset Successful!'}>
          <p style={{ color: '#64748b', fontSize: '14px', textAlign: 'center' }}>Redirecting to login...</p>
      </LoginLayout>
    );
  }

  return (
    <LoginLayout title={'Create New Password'} description={'Enter your new password below'}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='login-layout-form-inputs-wrapper'>
            <ControlledInputField
              type={showNewPassword ? 'text' : 'password'}
              control={control}
              name='newPassword'
              label='New Password'
              disabled={isSubmitting}
              rightChildren={<EyeToggleShowPasswordButton
                showPassword={showNewPassword}
                setShowPassword={setShowNewPassword}
              />}
            />
            <ControlledInputField
              type={showConfirmPassword ? 'text' : 'password'}
              control={control}
              name='confirmPassword'
              label='Confirm Password'
              disabled={isSubmitting}
              rightChildren={<EyeToggleShowPasswordButton
                showPassword={showConfirmPassword}
                setShowPassword={setShowConfirmPassword}
              />}
            />

          <SaysoButton
            label={isSubmitting ? 'Resetting Password...' : 'Reset Password'}
            onClick={() => handleSubmit(onSubmit)}
            fullWidth
            loading={isSubmitting}
            type='submit'
            />
          </div>
        </form>
        <p className='toggleText' onClick={handleBackToLogin}>
          Back to Log In
        </p>
      </LoginLayout>
  );
};

export default ResetPassword;

