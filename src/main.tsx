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

// After a new deploy, old chunk hashes 404 — reload once to pick up fresh assets
window.addEventListener('vite:preloadError', () => {
  window.location.reload();
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
