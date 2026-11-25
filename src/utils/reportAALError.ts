import * as Sentry from '@sentry/react';

/** Reports a failed AAL read. getAAL returns plain objects, which Sentry can't group. */
export default function reportAALError(error: unknown): void {
    if (error instanceof Error) {
        Sentry.captureException(error, { tags: { flow: 'mfa' } });
        return;
    }

    const { message, code } = (error ?? {}) as { message?: string; code?: string };
    Sentry.captureException(new Error(message ?? 'Could not read the session AAL'), { tags: { flow: 'mfa' }, extra: { code } });
}
