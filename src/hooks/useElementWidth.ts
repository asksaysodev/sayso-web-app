import { useCallback, useRef, useState } from 'react';

/**
 * Tracks an element's content width with a ResizeObserver.
 * @returns a callback ref for the element, and its width (null until first measured).
 */
export function useElementWidth<T extends HTMLElement>(): [(element: T | null) => void, number | null] {
    const [width, setWidth] = useState<number | null>(null);
    const observerRef = useRef<ResizeObserver | null>(null);

    const ref = useCallback((element: T | null) => {
        observerRef.current?.disconnect();
        observerRef.current = null;
        if (!element) return;
        const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
        observer.observe(element);
        observerRef.current = observer;
    }, []);

    return [ref, width];
}
