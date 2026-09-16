//STYLES
import './styles/Dashboard.css';
import Providers from './Providers';
import AppRoutes from './AppRoutes';
import StagingGuard from './components/guards/StagingGuard';
import StagingBanner from './components/StagingBanner';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from './config/supabase';
import * as Sentry from "@sentry/react";
import SaysoLoader from './components/SaysoLoader';
import { captureOfferTokenFromSearch } from './utils/offerToken';

const getHandoffToken = (hash: string): string | null => {
  if (hash.includes('type=recovery')) return null;
  return new URLSearchParams(hash.slice(1)).get('token_hash');
};

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [processingToken, setProcessingToken] = useState(() =>
    Boolean(getHandoffToken(window.location.hash))
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

  // Capture ?offer=<token> from the URL and persist it so invited users keep
  // legacy pricing through the signup/subscription flow (SAYSO-317).
  useEffect(() => {
    captureOfferTokenFromSearch(location.search);
  }, [location.search]);

  // Intercept password recovery tokens in URL hash to redirect to reset-password instead of login the user in automatically
  useEffect(() => {
    const hash = window.location.hash;
    const intendedPath = location.pathname;
    const hashParams = new URLSearchParams(hash.slice(1));
    const accessToken = hashParams.get('access_token');
    const handoffToken = getHandoffToken(hash);

    if (hash.includes('type=recovery') && hash.includes('access_token=')) {
      const hashContent = hash.split('#')[1];
      if (hashContent && accessToken) {
        const [route, queryString] = hashContent.split('?');
        if (!route.includes('/reset-password')) {
          navigate(`/reset-password?${queryString || hashContent}`, { replace: true });
        }
      }
    } else if (handoffToken) {
      supabase.auth.verifyOtp({ type: 'magiclink', token_hash: handoffToken })
        .then(({ error }) => {
          // Strip the token from the URL either way — it is single-use, and leaving it
          // in history hands it to anything that can read the address bar.
          if (error) {
            console.error('[App] Failed to redeem desktop handoff token:', error);
            Sentry.captureException(error, { tags: { flow: 'desktop_handoff' } });
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
      <StagingBanner />
      <div className='App'>
        <StagingGuard>
          <AppRoutes />
        </StagingGuard>
      </div>
    </Providers>
  );
}

export default App;
