import clsx from 'clsx';

import { Button, type ButtonProps } from '@/components/ds/Button';
import './SkipButton.css';

interface Props extends Omit<ButtonProps, 'variant' | 'size' | 'leftIcon' | 'asChild'> {
    /** `secondary` = ghost, no background/border ("Skip subscription"); `primary` = filled brand (SAYSO-564 "Go to dashboard"). */
    variant?: 'secondary' | 'primary';
}

/**
 * Button used below the sign-up step content to move on without the main action
 * (SAYSO-563 "Skip subscription", reused by SAYSO-564 "Go to dashboard").
 */
export default function SkipButton({ variant = 'secondary', className, ...props }: Props) {
    if (variant === 'primary') return <Button variant="primary" size="md" className={className} {...props} />;
    return <Button variant="ghost" size="md" className={clsx('skipButton--ghost', className)} {...props} />;
}
