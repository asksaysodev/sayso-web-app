import { useEffect, useState } from 'react';
import * as Sentry from '@sentry/react';
import { useAuth } from '@/context/AuthContext';
import { getAAL } from '@/services/mfaServices';

export type MFAStatus = 'checking' | 'required' | 'clear';

const CHECK_ATTEMPTS = 2;

const readAAL = async () => {
    let lastError: unknown;

    for (let attempt = 1; attempt <= CHECK_ATTEMPTS; attempt++) {
        try {
            const { data, error } = await getAAL();
            if (data && !error) return data;
            lastError = error;
        } catch (error) {
            lastError = error;
        }
    }

    throw lastError;
};

/**
 * Whether the current session still owes an MFA code. Read from the session, so it doesn't
 * wait for the account. Fails closed: an unreadable AAL counts as 'required'.
 *
 * Signed out is 'clear'. Token and user updates re-check in the background: going back to
 * 'checking' would unmount the page the user is on.
 */
export default function useMFAStatus(): MFAStatus {
    const { user, authToken, checkIfNeedsMFA } = useAuth();
    const [result, setResult] = useState<{ userId: string; status: MFAStatus } | null>(null);
    const userId = user?.id;

    useEffect(() => {
        if (!userId) return;
        let cancelled = false;

        readAAL()
            .then(({ currentLevel, nextLevel }) => checkIfNeedsMFA(currentLevel, nextLevel))
            .catch((error) => {
                Sentry.captureException(error);
                return true;
            })
            .then((needsMFA) => {
                if (!cancelled) setResult({ userId, status: needsMFA ? 'required' : 'clear' });
            });

        return () => {
            cancelled = true;
        };
    }, [userId, user, authToken, checkIfNeedsMFA]);

    if (!userId) return 'clear';
    return result?.userId === userId ? result.status : 'checking';
}
