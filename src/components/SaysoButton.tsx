import ButtonSpinner from './ButtonSpinner';
import '../styles/SaysoButton.css';

/**
 * Reusable button component with predefined variants
 * @param {string} label - Button text
 * @param {Function} onClick - Click handler
 * @param {boolean} disabled - Disable button interaction
 * @param {boolean} loading - Show loading spinner
 * @param {React.ReactNode} icon - Optional icon to display before label
 * @param {'sayso-indigo' | 'error' | 'outlined'} variant - Button style variant (default: 'sayso-indigo')
 * @param {boolean} fullWidth - Make button take full width of container (default: false)
 */

interface Props {
    label: string;
    onClick?: () => void;
    disabled?: boolean;
    loading?: boolean;
    icon?: React.ReactNode;
    variant?: 'sayso-indigo' | 'error' | 'outlined' | 'blue' | 'black';
    fullWidth?: boolean;
    type?: 'button' | 'submit' | 'reset';
    size?: 'sm' | 'lg';
    active?: boolean;
}

export default function SaysoButton({
    label,
    onClick,
    disabled = false,
    loading = false,
    icon,
    variant = 'sayso-indigo',
    fullWidth = false,
    type = 'button',
    size = 'lg',
    active = false
}: Props) {
    const spinnerColor = variant === 'outlined' ? '#000' : 'white';

    return (
        <button
            type={type}
            disabled={disabled || loading}
            className={`sayso-button variant-${variant} size-${size} ${loading ? 'loading' : ''} ${fullWidth ? 'full-width' : ''} ${active ? 'is-active' : ''}`}
            onClick={onClick}
        >
            {loading ? (
                <ButtonSpinner color={spinnerColor} size={18} />
            ) : (
                <>
                    {icon && <span className="sayso-button-icon">{icon}</span>}
                    {label && <span className="sayso-button-label">{label}</span>}
                </>
            )}
        </button>
    )
}