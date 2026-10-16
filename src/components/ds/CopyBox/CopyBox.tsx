import { useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import clsx from 'clsx';
import { Button } from '../Button';
import './CopyBox.css';

const COPIED_MS = 2000;

export interface CopyBoxProps {
    value: string;
    /** Button label before copying. */
    copyLabel?: string;
    /** Monospace, letter-spaced value (codes, secrets). */
    monospace?: boolean;
    /** `brand` (blue tint, default) or `neutral` (grey). */
    tone?: 'brand' | 'neutral';
    onCopied?: () => void;
    onCopyError?: () => void;
    className?: string;
}

/** Tinted read-only box with a copy button: reads as "copy this", not as an input. */
export function CopyBox({ value, copyLabel = 'Copy', monospace = false, tone = 'brand', onCopied, onCopyError, className }: CopyBoxProps) {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!copied) return;
        const timer = setTimeout(() => setCopied(false), COPIED_MS);
        return () => clearTimeout(timer);
    }, [copied]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            onCopied?.();
        } catch {
            onCopyError?.();
        }
    };

    return (
        <div className={clsx('ds-copy-box', tone === 'neutral' && 'ds-copy-box--neutral', className)}>
            <span className={clsx('ds-copy-box__value', monospace && 'ds-copy-box__value--mono')} title={value}>
                {value}
            </span>
            <Button
                variant='secondary'
                size='sm'
                leftIcon={copied ? <Check size={16} /> : <Copy size={16} />}
                onClick={handleCopy}
            >
                {copied ? 'Copied' : copyLabel}
            </Button>
        </div>
    );
}
