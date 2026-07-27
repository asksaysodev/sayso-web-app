import { forwardRef, ButtonHTMLAttributes } from 'react';
import ButtonSpinner from './ButtonSpinner';
import '../styles/SaysoButton.css';

/**
 * Reusable button component with predefined variants
 * @param {string} label - Button text
 * @param {Function} onClick - Click handler
 * @param {boolean} disabled - Disable button interaction
 * @param {boolean} loading - Show loading spinner
 * @param {string} loadingLabel - Optional text shown next to the spinner while loading (spinner-only if omitted)
 * @param {React.ReactNode} icon - Optional icon to display before label
 * @param {'sayso-indigo' | 'error' | 'error-outlined' | 'outlined'} variant - Button style variant (default: 'sayso-indigo')
 * @param {boolean} fullWidth - Make button take full width of container (default: false)
 *
 * Forwards its ref and any extra button props so it can be used as an `asChild`
 * target for Radix primitives (e.g. DialogTrigger), which need both to manage
 * focus restoration and aria state.
 */

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
    onClick?: () => void;
    disabled?: boolean;
    loading?: boolean;
    loadingLabel?: string;
    icon?: React.ReactNode;
    variant?: 'sayso-indigo' | 'error' | 'error-outlined' | 'outlined' | 'blue' | 'black';
    fullWidth?: boolean;
    type?: 'button' | 'submit' | 'reset';
    size?: 'sm' | 'lg';
}

const SaysoButton = forwardRef<HTMLButtonElement, Props>(function SaysoButton({
    label,
    onClick,
    disabled = false,
    loading = false,
    loadingLabel,
    icon,
    variant = 'sayso-indigo',
    fullWidth = false,
    type = 'button',
    size = 'lg',
    ...rest
}, ref) {
    const spinnerColor = variant === 'outlined' ? '#000' : variant === 'error-outlined' ? '#bf392f' : 'white';

    return (
        <button
            ref={ref}
            type={type}
            disabled={disabled || loading}
            className={`sayso-button variant-${variant} size-${size} ${loading ? 'loading' : ''} ${fullWidth ? 'full-width' : ''}`}
            onClick={onClick}
            {...rest}
        >
            {loading ? (
                <>
                    <ButtonSpinner color={spinnerColor} size={18} />
                    {loadingLabel && <span className="sayso-button-label">{loadingLabel}</span>}
                </>
            ) : (
                <>
                    {icon && <span className="sayso-button-icon">{icon}</span>}
                    {label && <span className="sayso-button-label">{label}</span>}
                </>
            )}
        </button>
    )
});

export default SaysoButton;
