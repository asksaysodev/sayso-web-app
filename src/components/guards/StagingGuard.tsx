import { useAuth } from '@/context/AuthContext';

const IS_STAGING = import.meta.env.VITE_APP_ENV === 'staging';

interface Props {
  children: React.ReactNode;
}

export default function StagingGuard({ children }: Props) {
  const { user, handleSignOut } = useAuth();

  if (!IS_STAGING) return <>{children}</>;

  if (user && user.app_metadata?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 gap-4 p-8 text-center">
        <div className="w-full max-w-sm flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-600 bg-amber-100 px-3 py-1 rounded-full">
              Staging Environment
            </span>
            <h1 className="text-xl font-semibold text-gray-900 mt-2">Access Restricted</h1>
            <p className="text-sm text-gray-500">
              This environment is for the Sayso team only.<br />
              <span className="font-medium text-gray-700">{user.email}</span> does not have access.
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="text-sm text-gray-500 underline hover:text-gray-700"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
