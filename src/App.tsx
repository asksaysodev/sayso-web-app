//STYLES
import './styles/App.css';
import './styles/Dashboard.css';
import Providers from './Providers';
import AppRoutes from './AppRoutes';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import * as Sentry from "@sentry/react";

function App() {
  const navigate = useNavigate();
  const location = useLocation();

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

    if (hash.includes('type=recovery') && hash.includes('access_token=')) {
      console.log('[App] Password recovery detected in URL, redirecting to reset-password');

      const hashContent = hash.split('#')[1];
      if (hashContent && hashContent.includes('access_token')) {
        const [route, params] = hashContent.split('?');

        if (!route.includes('/reset-password')) {
          navigate(`/reset-password?${params || hashContent}`, { replace: true });
        }
      }
    }
  }, [navigate, location]);

  return (
    <Providers>
      <div className='App'>
        <AppRoutes />
      </div>
    </Providers>
  );
}

export default App;
