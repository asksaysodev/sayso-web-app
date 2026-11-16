import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { LoaderCircle, Mail } from 'lucide-react';

import AuthLayout from '@/components/layouts/AuthLayout';
import { SignupProgress } from '@/components/auth/SignupProgress';
import { INVITATION_CLAIMED_MESSAGE } from '@/utils/signupErrors';
import { getOfferToken } from '@/utils/offerToken';
import { subscriptionPlansQuery } from '@/views/Subscription/services/getSubscriptionPlans';
import useSignupForm from './hooks/useSignupForm';
import PersonalDetailsForm from './components/PersonalDetailsForm';
import LoginDetailsForm from './components/LoginDetailsForm';
import './styles.css';

const Signup = () => {
    const {
        control,
        signupStep,
        isBtnLoading,
        isLeaving,
        handleSubmit,
        goBack,
        isInvite,
        invitation,
        isInvitationLoading,
        isInvitationError,
        isInvitationClaimed,
    } = useSignupForm();

    // Warm the plan step while the user fills in the form, so /signup/plan has no loader.
    // GET /pricing/plans is public; the plan step refetches it with the new session.
    // Invited sign-ups never see the plan step.
    const queryClient = useQueryClient();
    useEffect(() => {
        if (isInvite) return;
        void queryClient.prefetchQuery(subscriptionPlansQuery(getOfferToken()));
        // Also warm the lazy route chunk, so the optimistic jump to the plans is instant.
        void import('@/views/SignupPlan');
    }, [isInvite, queryClient]);

    const renderCard = () => {
        if (isInvite && isInvitationLoading) {
            return (
                <div className="signupCard signupCard--center" role="status" aria-label="Loading invitation">
                    <LoaderCircle className="signupCardSpinner" size={32} color="var(--primary-500)" aria-hidden="true" />
                </div>
            );
        }

        if (isInvitationError) {
            return (
                <div className="signupCard">
                    <div className="signupCardHeader">
                        <div>
                            <h2 className="signupCardHeading">
                                {isInvitationClaimed ? 'Invitation already claimed' : 'Invitation unavailable'}
                            </h2>
                            <p className="signupCardSubtitle">
                                {isInvitationClaimed
                                    ? `${INVITATION_CLAIMED_MESSAGE} Sign in to continue.`
                                    : 'This invitation is no longer valid. Please contact your administrator.'}
                            </p>
                        </div>
                    </div>
                    <div className="signupCardFooter">
                        <Link to="/login" className="signupCardLink">
                            Back to sign in
                        </Link>
                    </div>
                </div>
            );
        }

        return (
            <div className="signupCard">
                <div className="signupCardHeader">
                    <h2 className="signupCardHeading">{signupStep === 1 ? 'Personal details' : 'Login details'}</h2>
                    <span className="signupCardStep">{signupStep} of 2</span>
                </div>

                {isInvite && invitation && (
                    <div className="signupCardBanner" role="status">
                        <Mail size={20} color="var(--primary-500)" aria-hidden="true" />
                        <p>{`You've been invited by ${invitation.partner_name} — ${invitation.plan_name} plan`}</p>
                    </div>
                )}

                {signupStep === 1 ? (
                    <PersonalDetailsForm key="step-1" control={control} onSubmit={handleSubmit} />
                ) : (
                    <LoginDetailsForm
                        key="step-2"
                        control={control}
                        isBtnLoading={isBtnLoading}
                        disableEmail={isInvite}
                        onBack={goBack}
                        onSubmit={handleSubmit}
                    />
                )}
            </div>
        );
    };

    return (
        <AuthLayout
            title={isInvitationError ? "You've been invited" : 'Create account'}
            headerLink={{ prompt: 'Already have an account?', label: 'Sign in', to: '/login' }}
            transition={isLeaving ? 'exit' : undefined}
            aside={isInvitationError
                ? undefined
                : <SignupProgress current="account" hideSubscriptionStep={isInvite} />}
            topBarProgress={isInvitationError
                ? undefined
                : <SignupProgress current="account" hideSubscriptionStep={isInvite} variant="bar" />}
        >
            {renderCard()}
        </AuthLayout>
    );
};

export default Signup;
