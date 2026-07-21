import type { ErrorEvent, EventHint } from '@sentry/react';
import { isSessionExpiredError } from '@/utils/sessionExpired';
import { isSuspendedTabTimeoutError } from '@/utils/suspendedTabTimeout';

export const sentryConfig = {
  dsn: "https://2c444147dfb523db2091f3240ca27396@o4510697565585408.ingest.us.sentry.io/4510697705046016",
  beforeSend(event: ErrorEvent, hint: EventHint): ErrorEvent | null {
    const exception = hint.originalException;
    if (isSessionExpiredError(exception) || isSuspendedTabTimeoutError(exception)) return null;
    return event;
  },
}
