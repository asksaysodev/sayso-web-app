import LoginLoader from './components/LoginLoader';
import LoginCard from './components/LoginCard';
import SignUpStepOneFormInputs from './components/SignUpStepOneFormInputs';
import SignUpStepTwoFormInputs from './components/SignUpStepTwoFormInputs';
import useLoginForm from './hooks/useLoginForm';

import './styles.css';
import LoginLayout from '@/components/layouts/LoginLayout';
import AuthLayout from '@/components/layouts/AuthLayout';

const Login = () => {
  const {
    control,
    isLoggingIn,
    signupStep,
    error,
    isLoading,
    isBtnLoading,
    handleToggleMode,
    handleSubmit,
    setSignupStep,
    isInvite,
    invitation,
    isInvitationLoading,
    isInvitationError
  } = useLoginForm();

  if (isLoading || (isInvite && isInvitationLoading)) {
    return <LoginLoader />
  }

  if (isInvite && isInvitationError) {
    return (
      <LoginLayout title="Invitation">
        <div className="errorMessage">
          This invitation is no longer valid. Please contact your administrator.
        </div>
      </LoginLayout>
    )
  }

  const invitedByNote = isInvite && invitation
    ? `You've been invited by ${invitation.partner_name} — ${invitation.plan_name} plan`
    : undefined;

  if (isLoggingIn) {
    return (
      <AuthLayout
        title="Sign in"
        headerLink={{ prompt: "Don't have an account?", label: 'Sign up', to: '/login?signup=true' }}
      >
        <LoginCard control={control} isBtnLoading={isBtnLoading} onSubmit={handleSubmit} />
      </AuthLayout>
    );
  }

  return (
    <LoginLayout title="Create Account" description={invitedByNote} error={error}>
      <form onSubmit={handleSubmit}>
        {(
          signupStep === 1 ? (
            <SignUpStepOneFormInputs
              control={control}
            />
          ) : (
              <SignUpStepTwoFormInputs
                control={control}
                isBtnLoading={isBtnLoading}
                setSignupStep={setSignupStep}
                disableEmail={isInvite}
              />
          )
        )}
      </form>
      <p className="toggleText" onClick={handleToggleMode}>
        Already have an account? Sign In
      </p>
    </LoginLayout>
  )
};

export default Login;
