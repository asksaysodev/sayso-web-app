import { Eye, EyeOff } from 'lucide-react';
import './PasswordVisibilityToggle.css';

interface PasswordVisibilityToggleProps {
    shown: boolean;
    disabled: boolean;
    label: string;
    onToggle: () => void;
}

const PasswordVisibilityToggle = ({ shown, disabled, label, onToggle }: PasswordVisibilityToggleProps) => (
    <button
        type="button"
        className="resetCardEyeToggle"
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

export default PasswordVisibilityToggle;
