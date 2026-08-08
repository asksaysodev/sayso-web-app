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
// sessionStorage flag prevents an infinite loop if the new build is also broken;
// cleared on successful load so future deploys can recover too.
//
// preventDefault() must only be called on the reload path. Vite's preload helper
// swallows the error when the event is cancelled, which makes the dynamic import
// *resolve with undefined* rather than reject — React.lazy then reads `.default`
// off undefined and crashes the tree (SAYSO-APP-9W). On the non-reload path we let
// Vite rethrow so the lazy promise rejects and Suspense/error boundaries handle it.
window.addEventListener('vite:preloadError', (event) => {
  if (!sessionStorage.getItem('vite_reload')) {
    sessionStorage.setItem('vite_reload', '1');
    event.preventDefault();
    window.location.reload();
    return;
  }
  // Reload already tried and the chunk still failed — the deploy is genuinely
  // broken, so surface it as a handled error alongside the rethrow.
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
