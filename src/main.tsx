import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import './styles/App.css';
import './styles/Colors.css';
import './styles/Skeleton.css';
import * as Sentry from "@sentry/react";
import { sentryConfig } from '@/config/sentry';

Sentry.init(sentryConfig);

// After a new deploy, old chunk hashes 404 — reload once to pick up fresh assets.
// preventDefault() stops Vite from re-throwing the error to window.onerror (which
// otherwise reports it to Sentry as an unhandled error even though we recover).
// sessionStorage flag prevents an infinite loop if the new build is also broken;
// cleared on successful load so future deploys can recover too.
window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault();
  if (!sessionStorage.getItem('vite_reload')) {
    sessionStorage.setItem('vite_reload', '1');
    window.location.reload();
    return;
  }
  // Reload already tried and the chunk still failed — the deploy is genuinely
  // broken, so surface it as a handled error instead of silently swallowing it.
  Sentry.captureException((event as Event & { payload?: unknown }).payload ?? event, {
    tags: { source: 'vite-preload-error' },
  });
});
window.addEventListener('load', () => sessionStorage.removeItem('vite_reload'));

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
