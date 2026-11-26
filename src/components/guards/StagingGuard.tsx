import { useAuth } from '@/context/AuthContext';
import useSignOut from '@/hooks/useSignOut';
import './StagingGuard.css';

const IS_STAGING = import.meta.env.VITE_APP_ENV === 'staging';

interface Props {
  children: React.ReactNode;
}

export default function StagingGuard({ children }: Props) {
  const { user } = useAuth();
  const { signOut, isSigningOut } = useSignOut();

  if (!IS_STAGING) return <>{children}</>;

  if (user && user.app_metadata?.role !== 'admin') {
    return (
      <div className="staging-guard">
        <div className="staging-guard__content">
          <div className="staging-guard__header">
            <span className="staging-guard__badge">Staging Environment</span>
            <h1 className="staging-guard__title">Access Restricted</h1>
            <p className="staging-guard__body">
              This environment is for the Sayso team only.<br />
              <span className="staging-guard__email">{user.email}</span> does not have access.
            </p>
          </div>
          <button type="button" className="staging-guard__sign-out" onClick={() => void signOut()} disabled={isSigningOut}>
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
