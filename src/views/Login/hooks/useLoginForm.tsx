import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm, FieldErrors } from 'react-hook-form';
import {
  validateStepOneFields,
  validateLoginFields,
  validateSignupFields
} from '../helpers/formValidation';
import * as Sentry from "@sentry/react";
import { LoginFormData } from '../types';
import { getAAL } from '@/services/mfaServices';

const INITIAL_VALUES: LoginFormData = {
  name: '',
  lastname: '',
  company: '',
  email: '',
  password: '',
  repeatPassword: ''
};

export default function useLoginForm() {
  const [isLoggingIn, setIsLoggingIn] = useState(true);
  const [signupStep, setSignupStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isBtnLoading, setIsBtnLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, signUp, checkIfNeedsMFA } = useAuth();
  const [searchParams] = useSearchParams();
  const signupParam = searchParams.get("signup");
  const shouldShowSignUp = signupParam === null ? null : signupParam === "true";
  
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
    trigger
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
  }, [shouldShowSignUp])

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
            company: data.company
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
    setSignupStep
  }
}
