import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm, type FieldErrors } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import * as Sentry from '@sentry/react';

import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { toE164 } from '@/components/ui/PhoneInput';
import getPostSignupPath from '@/utils/getPostSignupPath';
import { useOptimisticSignupStore } from '@/store/optimisticSignupStore';
import reportApiError from '@/utils/reportApiError';
import type { SignupErrorCode } from '@/types/user';
import getInvitation from '../services/getInvitation';
import { isPhoneFilled, validateLoginDetails, validatePersonalDetails } from '../helpers/validation';
import type { SignupFormData, SignupSubStep } from '../types';

/** Matches the AuthLayout `exit` animation (authLayout.css). */
const STEP_EXIT_MS = 200;

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
    // Back from a failed optimistic sign-up: restore what was typed, on the login-details step.
    const [restoredDraft] = useState(() => {
        const { status, draft } = useOptimisticSignupStore.getState();
        return status === 'failed' ? draft : null;
    });
    const [signupStep, setSignupStep] = useState<SignupSubStep>(restoredDraft ? 2 : 1);
    const [isBtnLoading, setIsBtnLoading] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { showToast } = useToast();
    const { signUp } = useAuth();
    const { start: startOptimisticSignup, markCreated, fail: failOptimisticSignup, reset: resetOptimisticSignup } =
        useOptimisticSignupStore();
    // Read-only: query params (?referralCode=, ?invite=) must stay in the URL.
    const [searchParams] = useSearchParams();
    const inviteToken = searchParams.get('invite');

    useEffect(() => {
        if (restoredDraft) resetOptimisticSignup();
    }, [restoredDraft, resetOptimisticSignup]);

    const {
        data: invitation,
        isLoading: isInvitationLoading,
        isLoadingError: isInvitationError,
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

    const isInvitationClaimed = axios.isAxiosError<{ code?: SignupErrorCode }>(invitationError)
        && invitationError.response?.data?.code === 'INVITATION_CLAIMED';

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
        defaultValues: restoredDraft ?? INITIAL_VALUES,
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

        // Self sign-up is optimistic: show the plans right away and create the account in the
        // background (the plan step was prefetched while this form was filled in). On failure
        // /signup/plan sends the user back here with the form restored. Invites keep the
        // blocking flow: they land on the dashboard, which needs the account to exist.
        // The form plays its exit animation first (AuthLayout `exit`); the account request
        // starts right away regardless.
        const isOptimistic = !inviteToken;
        let leaveTimer: number | undefined;
        if (isOptimistic) {
            startOptimisticSignup(data, `${location.pathname}${location.search}`);
            setIsLeaving(true);
            leaveTimer = window.setTimeout(() => {
                leaveTimer = undefined;
                navigate(getPostSignupPath(inviteToken), { replace: true });
            }, prefersReducedMotion() ? 0 : STEP_EXIT_MS);
        } else {
            setIsBtnLoading(true);
        }

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
            if (isOptimistic) markCreated();
            else navigate(getPostSignupPath(inviteToken), { replace: true });
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Sign up failed. Please try again.';
            showToast('error', message);
            console.error('Sign up error:', err);
            Sentry.captureException(err);
            if (isOptimistic && leaveTimer !== undefined) {
                // Failed before the exit animation finished: still on the form, so just stay.
                window.clearTimeout(leaveTimer);
                setIsLeaving(false);
                resetOptimisticSignup();
            } else if (isOptimistic) {
                failOptimisticSignup();
            }
        } finally {
            // Unmounted by now on the optimistic path; React ignores the update.
            if (!isOptimistic) setIsBtnLoading(false);
        }
    };

    return {
        control,
        signupStep,
        isBtnLoading,
        isLeaving,
        handleSubmit: rhfHandleSubmit(onSubmit),
        goBack,
        isInvite: !!inviteToken,
        invitation,
        isInvitationLoading,
        isInvitationError,
        isInvitationClaimed,
    };
}
