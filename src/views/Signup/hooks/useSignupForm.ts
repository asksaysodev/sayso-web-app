import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm, type FieldErrors } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import * as Sentry from '@sentry/react';

import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { toE164 } from '@/components/ui/PhoneInput';
import reportApiError from '@/utils/reportApiError';
import getInvitation from '../services/getInvitation';
import { isPhoneFilled, validateLoginDetails, validatePersonalDetails } from '../helpers/validation';
import type { SignupFormData, SignupSubStep } from '../types';

const INITIAL_VALUES: SignupFormData = {
    name: '',
    lastname: '',
    company: '',
    phone: '',
    email: '',
    password: '',
    repeatPassword: '',
};

export default function useSignupForm() {
    const [signupStep, setSignupStep] = useState<SignupSubStep>(1);
    const [isBtnLoading, setIsBtnLoading] = useState(false);
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { signUp } = useAuth();
    // Read-only: query params (?referralCode=, ?invite=) must stay in the URL.
    const [searchParams] = useSearchParams();
    const inviteToken = searchParams.get('invite');

    const {
        data: invitation,
        isLoading: isInvitationLoading,
        isError: isInvitationError,
        error: invitationError,
    } = useQuery({
        queryKey: ['invitation', inviteToken],
        queryFn: () => getInvitation(inviteToken as string),
        enabled: !!inviteToken,
        retry: false,
    });

    useEffect(() => {
        if (invitationError) {
            reportApiError(invitationError, { feature: 'partner-invitations', operation: 'getInvitation' });
        }
    }, [invitationError]);

    const resolver = (values: SignupFormData) => {
        const errors = signupStep === 1 ? validatePersonalDetails(values) : validateLoginDetails(values);
        const keys = Object.keys(errors) as (keyof SignupFormData)[];
        return {
            values: keys.length === 0 ? values : {},
            errors: keys.reduce<FieldErrors<SignupFormData>>((acc, key) => {
                acc[key] = { type: 'validation', message: errors[key] };
                return acc;
            }, {}),
        };
    };

    const { control, handleSubmit: rhfHandleSubmit, setValue, clearErrors } = useForm<SignupFormData>({
        resolver,
        mode: 'onSubmit',
        reValidateMode: 'onBlur',
        defaultValues: INITIAL_VALUES,
    });

    useEffect(() => {
        if (invitation?.email) setValue('email', invitation.email);
    }, [invitation, setValue]);

    const goBack = () => {
        clearErrors();
        setSignupStep(1);
    };

    const onSubmit = async (data: SignupFormData) => {
        if (signupStep === 1) {
            setSignupStep(2);
            return;
        }

        setIsBtnLoading(true);
        try {
            const { error } = await signUp({
                email: data.email,
                password: data.password,
                options: {
                    data: {
                        name: data.name,
                        lastname: data.lastname,
                        company: data.company,
                        phone: isPhoneFilled(data.phone) ? toE164(data.phone) : undefined,
                        invite_token: inviteToken || undefined,
                    },
                },
            });
            if (error) throw error;
            navigate('/signup/plan', { replace: true });
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Sign up failed. Please try again.';
            showToast('error', message);
            console.error('Sign up error:', err);
            Sentry.captureException(err);
        } finally {
            setIsBtnLoading(false);
        }
    };

    return {
        control,
        signupStep,
        isBtnLoading,
        handleSubmit: rhfHandleSubmit(onSubmit),
        goBack,
        isInvite: !!inviteToken,
        invitation,
        isInvitationLoading,
        isInvitationError,
    };
}
