import type { ErrorEvent, EventHint } from '@sentry/react';
import { isSessionExpiredError } from '@/utils/sessionExpired';
import { isSuspendedTabTimeoutError } from '@/utils/suspendedTabTimeout';
import { isLockAcquireTimeoutError } from '@/utils/lockTimeout';

export const sentryConfig = {
  dsn: "https://2c444147dfb523db2091f3240ca27396@o4510697565585408.ingest.us.sentry.io/4510697705046016",
  environment: import.meta.env.VITE_APP_ENV || 'production',
  beforeSend(event: ErrorEvent, hint: EventHint): ErrorEvent | null {
    const exception = hint.originalException;
    if (isSessionExpiredError(exception) || isSuspendedTabTimeoutError(exception) || isLockAcquireTimeoutError(exception)) return null;
    return event;
  },
  // Message-level backstop for the lock timeout above. Both lock implementations
  // are listed because the message differs between them — matching only the
  // navigatorLock wording is what let SAYSO-APP-A9 through after supabase.ts
  // switched to processLock.
  ignoreErrors: [/Acquiring (an exclusive Navigator LockManager lock|process lock)/],
}
