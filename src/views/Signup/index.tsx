import { Link } from 'react-router-dom';
import { LoaderCircle, Mail } from 'lucide-react';

import AuthLayout from '@/components/layouts/AuthLayout';
import { SignupProgress } from '@/components/auth/SignupProgress';
import useSignupForm from './hooks/useSignupForm';
import PersonalDetailsForm from './components/PersonalDetailsForm';
import LoginDetailsForm from './components/LoginDetailsForm';
import './styles.css';

const Signup = () => {
    const {
        control,
        signupStep,
        isBtnLoading,
        handleSubmit,
        goBack,
        isInvite,
        invitation,
        isInvitationLoading,
        isInvitationError,
    } = useSignupForm();

    const renderCard = () => {
        if (isInvite && isInvitationLoading) {
            return (
                <div className="signupCard signupCard--center" role="status" aria-label="Loading invitation">
                    <LoaderCircle className="signupCardSpinner" size={32} color="var(--primary-500)" aria-hidden="true" />
                </div>
            );
        }

        if (isInvite && isInvitationError) {
            return (
                <div className="signupCard">
                    <div className="signupCardHeader">
                        <div>
                            <h2 className="signupCardHeading">Invitation unavailable</h2>
                            <p className="signupCardSubtitle">
                                This invitation is no longer valid. Please contact your administrator.
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
            title="Create account"
            headerLink={{ prompt: 'Already have an account?', label: 'Sign in', to: '/login' }}
            aside={<SignupProgress current="account" />}
        >
            {renderCard()}
        </AuthLayout>
    );
};

export default Signup;
