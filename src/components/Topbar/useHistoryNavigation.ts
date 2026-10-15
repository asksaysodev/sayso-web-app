import { useEffect, useSyncExternalStore } from 'react';
import { useLocation, useNavigationType, type NavigationType } from 'react-router-dom';

let furthestIndex = 0;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

function getFurthestIndex() {
    return furthestIndex;
}

function recordNavigation(index: number, navigationType: NavigationType) {
    furthestIndex = navigationType === 'POP' ? Math.max(furthestIndex, index) : index;
    listeners.forEach((listener) => listener());
}

function currentIndex(): number {
    const idx = (window.history.state as { idx?: number } | null)?.idx;
    return typeof idx === 'number' ? idx : 0;
}

/**
 * Whether the in-app history can go back / forward. The furthest visited entry lives at module level because the shell remounts on every route.
 */
export default function useHistoryNavigation(): { canGoBack: boolean; canGoForward: boolean } {
    const { key } = useLocation();
    const navigationType = useNavigationType();
    const furthest = useSyncExternalStore(subscribe, getFurthestIndex);
    const index = currentIndex();

    useEffect(() => {
        recordNavigation(currentIndex(), navigationType);
    }, [key, navigationType]);

    return { canGoBack: index > 0, canGoForward: index < furthest };
}
