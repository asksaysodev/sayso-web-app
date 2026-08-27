import { useNavigate } from 'react-router-dom';

import LoginLoader from './components/LoginLoader';
import LoginInFormInputs from './components/LoginInFormInputs';
import SignUpStepOneFormInputs from './components/SignUpStepOneFormInputs';
import SignUpStepTwoFormInputs from './components/SignUpStepTwoFormInputs';
import useLoginForm from './hooks/useLoginForm';

import './styles.css';
import LoginLayout from '@/components/layouts/LoginLayout';

const Login = () => {
  const navigate = useNavigate();
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

  return (
    <LoginLayout title={isLoggingIn ? 'Welcome Back!' : `Create Account`} description={invitedByNote} error={error}>
      <form onSubmit={handleSubmit}>
        {isLoggingIn ? (
          <LoginInFormInputs
            control={control}
            isBtnLoading={isBtnLoading}
          />
        ) : (
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
        {isLoggingIn ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
      </p>
      {isLoggingIn && (
        <p className="toggleText forgotPasswordText" onClick={() => navigate('/forgot-password')}>
          Forgot password? Click here
        </p>
      )}
    </LoginLayout>
  )
};

export default Login;
