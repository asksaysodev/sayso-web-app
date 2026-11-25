import { useAuth } from '@/context/AuthContext';
import { useEffect, useEffectEvent, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm, FieldErrors } from 'react-hook-form';
import { validateLoginFields } from '../helpers/formValidation';
import * as Sentry from "@sentry/react";
import { LoginFormData } from '../types';
import { useToast } from '@/context/ToastContext';
import { getIntendedPath } from '@/utils/intendedPath';

const INITIAL_VALUES: LoginFormData = {
  email: '',
  password: ''
};

export default function useLoginForm() {
  const [isBtnLoading, setIsBtnLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const { signIn, user, accountNotFound, signOutLocally } = useAuth();
  const hadSessionRef = useRef(false);
  const isRejectingAccountRef = useRef(false);

  const rejectMissingAccount = useEffectEvent(async () => {
    if (isRejectingAccountRef.current) return;
    isRejectingAccountRef.current = true;

    if (await signOutLocally()) {
      showToast('error', "We couldn't find an account for this email.");
    } else {
      // Still signed in: the page behind AuthGuard offers retry and sign out.
      navigate(getIntendedPath(location.state), { replace: true });
    }
  });

  useEffect(() => {
    if (user && accountNotFound) rejectMissingAccount();
  }, [user, accountNotFound]);

  const onSessionLost = useEffectEvent(() => {
    if (!isRejectingAccountRef.current) showToast('error', "We couldn't sign you in. Please try again.");
    isRejectingAccountRef.current = false;
  });

  useEffect(() => {
    if (!user && hadSessionRef.current) onSessionLost();
    hadSessionRef.current = !!user;
  }, [user]);

  const customResolver = (values: LoginFormData) => {
    const errors = validateLoginFields(values);

    return {
      values: Object.keys(errors).length === 0 ? values : {},
      errors: Object.keys(errors).reduce<FieldErrors<LoginFormData>>((acc, key) => {
        acc[key as keyof LoginFormData] = { type: 'validation', message: errors[key as keyof typeof errors] };
        return acc;
      }, {})
    };
  };

  const {
    control,
    handleSubmit: rhfHandleSubmit
  } = useForm<LoginFormData>({
    resolver: customResolver,
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    defaultValues: INITIAL_VALUES
  });

  const performAuthentication = async (data: LoginFormData) => {
    const signInResult = await signIn({
      email: data.email,
      password: data.password
    });

    if (signInResult?.error) throw signInResult.error;
  };

  const onSubmit = async (data: LoginFormData) => {
    setIsBtnLoading(true);

    try {
      await performAuthentication(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Authentication failed. Please try again.';
      showToast(
        'error',
        message === 'Invalid login credentials'
          ? 'Email or password is incorrect. Please try again.'
          : message
      );
      console.error('Authentication error:', err);
      Sentry.captureException(err);
    } finally {
      setIsBtnLoading(false);
    }
  };

  const handleSubmit = rhfHandleSubmit(onSubmit);

  return {
    control,
    // GuestGuard keeps this form up until it knows where the new session goes.
    isBtnLoading: isBtnLoading || !!user,
    handleSubmit
  }
}
