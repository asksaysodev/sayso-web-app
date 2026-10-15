import { useCallback, useState } from 'react';
import * as Sentry from '@sentry/react';

const STORAGE_KEY = 'sayso-sidebar-collapsed';

function readCollapsed(): boolean {
    try {
        return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch (error) {
        Sentry.captureException(error);
        return false;
    }
}

export default function useSidebarCollapsed(): [boolean, () => void] {
    const [collapsed, setCollapsed] = useState(readCollapsed);

    const toggle = useCallback(() => {
        setCollapsed((prev) => {
            const next = !prev;
            try {
                localStorage.setItem(STORAGE_KEY, String(next));
            } catch (error) {
                Sentry.captureException(error);
            }
            return next;
        });
    }, []);

    return [collapsed, toggle];
}
