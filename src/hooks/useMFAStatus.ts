import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getAAL } from '@/services/mfaServices';
import reportAALError from '@/utils/reportAALError';

type MFAStatus = 'checking' | 'required' | 'clear';

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
 * wait for the account. Fails closed: an unreadable AAL counts as 'required', unless this
 * session was already 'clear' (a failed re-check must not take the user off their page).
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
            .then(({ currentLevel, nextLevel }) => {
                if (cancelled) return;
                setResult({ userId, status: checkIfNeedsMFA(currentLevel, nextLevel) ? 'required' : 'clear' });
            })
            .catch((error) => {
                reportAALError(error);
                if (cancelled) return;
                setResult((previous) =>
                    previous?.userId === userId && previous.status === 'clear' ? previous : { userId, status: 'required' }
                );
            });

        return () => {
            cancelled = true;
        };
    }, [userId, user, authToken, checkIfNeedsMFA]);

    // The next session of the same user must be checked from scratch.
    if (!userId && result) setResult(null);

    if (!userId) return 'clear';
    return result?.userId === userId ? result.status : 'checking';
}
