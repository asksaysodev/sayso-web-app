//STYLES
import './styles/App.css';
import './styles/Dashboard.css';
import Providers from './Providers';
import AppRoutes from './AppRoutes';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from './config/supabase';
import * as Sentry from "@sentry/react";
import SaysoLoader from './components/SaysoLoader';

const hasAuthTokens = (hash: string) =>
  !hash.includes('type=recovery') &&
  hash.includes('access_token=') &&
  hash.includes('refresh_token=');

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [processingToken, setProcessingToken] = useState(() =>
    hasAuthTokens(window.location.hash)
  );

  // Track navigation changes in Sentry breadcrumbs
  useEffect(() => {
    Sentry.addBreadcrumb({
      category: 'navigation',
      message: `Navigated to ${location.pathname}`,
      level: 'info',
      data: {
        pathname: location.pathname,
        search: location.search,
        hash: location.hash,
        state: location.state
      }
    });
  }, [location]);

  // Intercept password recovery tokens in URL hash to redirect to reset-password instead of login the user in automatically
  useEffect(() => {
    const hash = window.location.hash;
    const intendedPath = location.pathname;
    const hashParams = new URLSearchParams(hash.slice(1));
    const accessToken = hashParams.get('access_token');
    const refreshToken = hashParams.get('refresh_token');

    if (hash.includes('type=recovery') && hash.includes('access_token=')) {
      console.log('[App] Password recovery detected in URL, redirecting to reset-password');
      const hashContent = hash.split('#')[1];
      if (hashContent && accessToken) {
        const [route, queryString] = hashContent.split('?');
        if (!route.includes('/reset-password')) {
          navigate(`/reset-password?${queryString || hashContent}`, { replace: true });
        }
      }
    } else if (hasAuthTokens(hash)) {
      supabase.auth.setSession({ access_token: accessToken!, refresh_token: refreshToken! })
        .then(({ error }) => {
          if (error) {
            console.error('[App] Failed to set session from desktop token:', error);
            window.history.replaceState(null, '', '/login');
            navigate('/login', { replace: true });
          } else {
            window.history.replaceState(null, '', intendedPath);
            navigate(intendedPath, { replace: true });
          }
        })
        .finally(() => setProcessingToken(false));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (processingToken) {
    return <SaysoLoader />;
  }

  return (
    <Providers>
      <div className='App'>
        <AppRoutes />
      </div>
    </Providers>
  );
}

export default App;
