import LoginCard from './components/LoginCard';
import useLoginForm from './hooks/useLoginForm';

import './styles.css';
import AuthLayout from '@/components/layouts/AuthLayout';

const Login = () => {
  const { control, isBtnLoading, handleSubmit } = useLoginForm();

  return (
    <AuthLayout
      title="Sign in"
      headerLink={{ prompt: "Don't have an account?", label: 'Sign up', to: '/signup' }}
    >
      <LoginCard control={control} isBtnLoading={isBtnLoading} onSubmit={handleSubmit} />
    </AuthLayout>
  );
};

export default Login;
