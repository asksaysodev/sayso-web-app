import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams} from 'react-router-dom';
import { useForm, FieldErrors } from 'react-hook-form';
import { toE164 } from '@/components/ui/PhoneInput';
import {
  validateStepOneFields,
  validateLoginFields,
  validateSignupFields
} from '../helpers/formValidation';
import * as Sentry from "@sentry/react";
import { useQuery } from '@tanstack/react-query';
import { LoginFormData } from '../types';
import { getAAL } from '@/services/mfaServices';
import getInvitation from '../services/getInvitation';
import reportApiError from '@/utils/reportApiError';

const INITIAL_VALUES: LoginFormData = {
  name: '',
  lastname: '',
  company: '',
  email: '',
  password: '',
  repeatPassword: '',
  phone: ''
};

export default function useLoginForm() {
  const [isLoggingIn, setIsLoggingIn] = useState(true);
  const [signupStep, setSignupStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isBtnLoading, setIsBtnLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, signUp, checkIfNeedsMFA } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const signupParam = searchParams.get("signup");
  const inviteToken = searchParams.get("invite");
  const shouldShowSignUp = signupParam === "true" || !!searchParams.get("referralCode") || !!inviteToken;

  const {
    data: invitation,
    isLoading: isInvitationLoading,
    isError: isInvitationError,
    error: invitationError
  } = useQuery({
    queryKey: ['invitation', inviteToken],
    queryFn: () => getInvitation(inviteToken as string),
    enabled: !!inviteToken,
    retry: false
  });

  useEffect(() => {
    if (invitationError) reportApiError(invitationError, { feature: 'partner-invitations', operation: 'getInvitation' });
  }, [invitationError])

  const customResolver = (values: LoginFormData) => {
    let errors = {};

    if (!isLoggingIn && signupStep === 1) {
      errors = validateStepOneFields(values);
    } else if (isLoggingIn) {
      errors = validateLoginFields(values);
    } else {
      errors = validateSignupFields(values);
    }

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
    reset,
    handleSubmit: rhfHandleSubmit,
    trigger,
    setValue
  } = useForm<LoginFormData>({
    resolver: customResolver,
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    defaultValues: INITIAL_VALUES
  });

  const handleToggleMode = () => {
    setIsLoggingIn(!isLoggingIn);
    setError(null);
    setSignupStep(1);
    reset(INITIAL_VALUES);
  };

  useEffect(()=>{
      if (!shouldShowSignUp) return;
      handleToggleMode();
      setSearchParams(inviteToken ? { invite: inviteToken } : {}, { replace: true });
  }, [shouldShowSignUp])

  useEffect(()=>{
      if (invitation?.email) {
        setValue('email', invitation.email);
      }
  }, [invitation, setValue])

  const performAuthentication = async (data: LoginFormData) => {
    if (isLoggingIn) {
      const signInResult = await signIn({
        email: data.email,
        password: data.password
      });

      if (signInResult?.error) throw signInResult.error;

      let aalResult = await getAAL();

      if (aalResult.error) {
        aalResult = await getAAL();
      }

      if (aalResult.error || !aalResult.data) {                                                                                                                                                  
        navigate('/mfa-verify', { replace: true });                                                                                                                                              
        return;                                                                                                                                                                                  
      }       

      const needsMFA = checkIfNeedsMFA(aalResult.data.currentLevel, aalResult.data.nextLevel);

      if (needsMFA) {
        navigate('/mfa-verify', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } else {
      const { error } = await signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            lastname: data.lastname,
            company: data.company,
            phone: data.phone && data.phone.trim() !== '+1' ? toE164(data.phone) : undefined,
            invite_token: inviteToken || undefined
          }
        }
      });
      if (error) throw error;
      navigate('/', { replace: true });
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    setError(null);

    if (!isLoggingIn && signupStep === 1) {
      setSignupStep(2);
      return;
    }

    setIsBtnLoading(true);

    try {
      await performAuthentication(data);
    } catch (err: any) {
      setError(err.message);
      console.error('Authentication error:', err);
      Sentry.captureException(err);
    } finally {
      setIsBtnLoading(false);
    }
  };

  const handleSubmit = rhfHandleSubmit(onSubmit);

  return {
    control,
    isLoggingIn,
    signupStep,
    error,
    isLoading,
    isBtnLoading,
    handleToggleMode,
    handleSubmit,
    setSignupStep,
    isInvite: !!inviteToken,
    invitation,
    isInvitationLoading,
    isInvitationError
  }
}
