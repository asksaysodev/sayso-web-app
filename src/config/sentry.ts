import type { Breadcrumb, ErrorEvent, EventHint } from '@sentry/react';
import { isSessionExpiredError } from '@/utils/sessionExpired';
import { isSuspendedTabTimeoutError } from '@/utils/suspendedTabTimeout';
import { isLockAcquireTimeoutError } from '@/utils/lockTimeout';
import { redactUrlTokens } from '@/utils/redactUrlTokens';

export const sentryConfig = {
  dsn: "https://2c444147dfb523db2091f3240ca27396@o4510697565585408.ingest.us.sentry.io/4510697705046016",
  environment: import.meta.env.VITE_APP_ENV || 'production',
  beforeSend(event: ErrorEvent, hint: EventHint): ErrorEvent | null {
    const exception = hint.originalException;
    if (isSessionExpiredError(exception) || isSuspendedTabTimeoutError(exception) || isLockAcquireTimeoutError(exception)) return null;
    if (event.request?.url) event.request.url = redactUrlTokens(event.request.url);
    return event;
  },
  beforeBreadcrumb(breadcrumb: Breadcrumb): Breadcrumb {
    if (breadcrumb.category !== 'navigation' || !breadcrumb.data) return breadcrumb;
    const data = Object.fromEntries(Object.entries(breadcrumb.data).map(
      ([key, value]) => [key, typeof value === 'string' ? redactUrlTokens(value) : value],
    ));
    return { ...breadcrumb, data };
  },
  // Message-level backstop for the lock timeout above. Both lock implementations
  // are listed because the message differs between them — matching only the
  // navigatorLock wording is what let SAYSO-APP-A9 through after supabase.ts
  // switched to processLock.
  ignoreErrors: [
    /Acquiring (an exclusive Navigator LockManager lock|process lock)/,
    // ReferralRocket widget (index.html) rejects when its impression-count call
    // fails. Message-level backstop for denyUrls below: unhandled rejections can
    // arrive without stack frames, which denyUrls can't match (SAYSO-APP-BR).
    /Failed to complete the action: Unexpected response status/,
  ],
  // Third-party scripts whose errors aren't ours to fix.
  denyUrls: [/referralrocket\.io/],
}
