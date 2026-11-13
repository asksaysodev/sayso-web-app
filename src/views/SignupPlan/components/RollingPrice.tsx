import { useEffect, useState } from 'react';
import clsx from 'clsx';

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
// Delay between neighbouring columns, so the digits roll one after another like a mechanical counter.
const STAGGER_MS = 45;

interface Props {
    /** Formatted amount without the currency sign, e.g. "1,449" or "124.92". */
    value: string;
    className?: string;
}

/**
 * Shows a price whose digits roll up or down to the new value, fading at the edges as they move.
 * Columns are matched by place value (hundreds to hundreds, cents to cents), so only digits that changed move.
 */
export default function RollingPrice({ value, className }: Props) {
    // Columns that appear after the first render (e.g. ".92" when switching to yearly) roll in; the first render doesn't animate.
    const [hasMounted, setHasMounted] = useState(false);
    useEffect(() => {
        const frame = requestAnimationFrame(() => setHasMounted(true));
        return () => cancelAnimationFrame(frame);
    }, []);

    const dot = value.indexOf('.');
    const pointIndex = dot === -1 ? value.length : dot;
    const chars = value.split('');

    return (
        <span className={clsx('rollingPrice', className)}>
            <span className="sr-only">${value}</span>
            <span aria-hidden="true">
                $
                {chars.map((char, i) => {
                    const place = i - pointIndex;
                    const isDigit = char >= '0' && char <= '9';
                    const key = `${isDigit ? 'd' : 's'}${place}`;
                    const delay = (chars.length - 1 - i) * STAGGER_MS;
                    return isDigit ? (
                        <RollingDigit key={key} digit={Number(char)} delayMs={delay} animateIn={hasMounted} />
                    ) : (
                        <RollingSymbol key={key} char={char} animateIn={hasMounted} />
                    );
                })}
            </span>
        </span>
    );
}

function RollingDigit({ digit, delayMs, animateIn }: { digit: number; delayMs: number; animateIn: boolean }) {
    // Captured once at mount, so a re-render mid-animation doesn't cut the entry short.
    const [entering] = useState(animateIn);
    return (
        <span className={clsx('rollingDigit', entering && 'rollingEnter')}>
            {/* Invisible copy keeps the column's width and text baseline in the price row. */}
            <span className="rollingDigitGhost">{digit}</span>
            <span className="rollingDigitWindow">
                <span
                    className="rollingDigitStrip"
                    style={{ transform: `translateY(${digit * -10}%)`, transitionDelay: `${delayMs}ms` }}
                >
                    {DIGITS.map((d) => (
                        <span key={d}>{d}</span>
                    ))}
                </span>
            </span>
        </span>
    );
}

function RollingSymbol({ char, animateIn }: { char: string; animateIn: boolean }) {
    const [entering] = useState(animateIn);
    return <span className={clsx('rollingSymbol', entering && 'rollingEnter')}>{char}</span>;
}
