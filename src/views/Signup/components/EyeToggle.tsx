import { Eye, EyeOff } from 'lucide-react';

interface Props {
    shown: boolean;
    disabled?: boolean;
    label: string;
    onToggle: () => void;
}

export default function EyeToggle({ shown, disabled, label, onToggle }: Props) {
    return (
        <button
            type="button"
            className="signupCardEyeToggle"
            onClick={onToggle}
            disabled={disabled}
            aria-label={shown ? `Hide ${label}` : `Show ${label}`}
            aria-pressed={shown}
        >
            {shown ? (
                <EyeOff size={24} color="var(--text-secondary)" aria-hidden="true" />
            ) : (
                <Eye size={24} color="var(--text-secondary)" aria-hidden="true" />
            )}
        </button>
    );
}
