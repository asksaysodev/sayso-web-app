import { useCallback, useEffect, useState } from 'react';

const TICK_MS = 250;

/**
 * Countdown based on a deadline timestamp (no accumulated interval drift).
 * `remaining` is whole seconds left, rounded up; 0 when idle or finished.
 */
export function useResendCountdown(seconds: number) {
    const [deadline, setDeadline] = useState<number | null>(null);
    const [remaining, setRemaining] = useState(0);

    useEffect(() => {
        if (deadline === null) return;

        const tick = () => {
            const left = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
            setRemaining(left);
            if (left === 0) {
                setDeadline(null);
                return true;
            }
            return false;
        };

        if (tick()) return;
        const id = setInterval(tick, TICK_MS);
        return () => clearInterval(id);
    }, [deadline]);

    const start = useCallback(() => {
        setRemaining(seconds);
        setDeadline(Date.now() + seconds * 1000);
    }, [seconds]);

    return { remaining, isActive: remaining > 0, start };
}

export function formatCountdown(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${minutes}:${String(secs).padStart(2, '0')}`;
}
