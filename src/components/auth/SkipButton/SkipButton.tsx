import { Button, type ButtonProps } from '@/components/ds/Button';

interface Props extends Omit<ButtonProps, 'variant' | 'size' | 'leftIcon' | 'asChild'> {
    /** `secondary` = white, bordered (Figma "Skip subscription"); `primary` = filled brand (SAYSO-564 "Go to dashboard"). */
    variant?: 'secondary' | 'primary';
}

/**
 * Button used below the sign-up step content to move on without the main action
 * (SAYSO-563 "Skip subscription", reused by SAYSO-564 "Go to dashboard").
 */
export default function SkipButton({ variant = 'secondary', ...props }: Props) {
    return <Button variant={variant} size="md" {...props} />;
}
