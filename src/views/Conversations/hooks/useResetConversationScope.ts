import { useEffect } from 'react';
import axios from 'axios';

/**
 * A team or member that no longer exists drops the admin back to their own conversations, silently:
 * either the server 404s it, or the loaded team/member lists don't have it.
 * @returns `true` while the reset is pending, so the caller can hold its loading state instead of an error.
 */
export default function useResetConversationScope(
    error: unknown,
    isStale: boolean,
    isOwnSelection: boolean,
    resetToOwn: () => void,
): boolean {
    const isNotFound = axios.isAxiosError(error) && error.response?.status === 404;
    const isResetting = !isOwnSelection && (isNotFound || isStale);

    useEffect(() => {
        if (isResetting) resetToOwn();
    }, [isResetting, resetToOwn]);

    return isResetting;
}
