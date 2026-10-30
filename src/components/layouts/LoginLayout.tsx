import AuthLayout from './AuthLayout';
import './styles/loginLayout.css';

interface Props {
    children: React.ReactNode;
    title?: string;
    description?: string;
    error?: string | null;
}

/**
 * Legacy auth card rendered on the shared AuthLayout shell. Views move to
 * AuthLayout directly as they are restyled (SAYSO-522 / SAYSO-523).
 */
export default function LoginLayout({ children, title, description, error }: Props) {
    return (
        <AuthLayout>
            <div className="loginLayoutForm">
                {title && <h2>{title}</h2>}
                {description && <p className="loginLayoutDescription">{description}</p>}
                {error && <div className="errorMessage">{error}</div>}
                {children}
            </div>
        </AuthLayout>
    )
}
