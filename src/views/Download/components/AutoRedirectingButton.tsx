import { useEffect, useState } from 'react';

const REDIRECT_SECONDS = 5;

interface Props {
    onCancel: () => void;
    onComplete: () => void;
}

export default function AutoRedirectingButton({ onCancel, onComplete }: Props) {
    const [secondsLeft, setSecondsLeft] = useState(REDIRECT_SECONDS);
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        if (paused) return;

        if (secondsLeft <= 0) {
            onComplete();
            return;
        }

        const timeout = setTimeout(() => setSecondsLeft(prev => prev - 1), 1000);
        return () => clearTimeout(timeout);
    }, [secondsLeft, paused, onComplete]);

    return (
        <div
            className='auto-redirect-pill'
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            <span className='auto-redirect-badge'>{Math.max(secondsLeft, 1)}</span>
            <span className='auto-redirect-label'>
                {paused ? 'Paused — hover off to resume' : 'Redirecting to dashboard…'}
            </span>
            <button className='auto-redirect-cancel-btn' onClick={onCancel}>
                Cancel
            </button>
        </div>
    );
}
