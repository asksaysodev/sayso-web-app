import TopDragBar from "../TopDragBar";
import logoVertical from '/assets/logo-pos-vertical.png';
import './styles/loginLayout.css';

interface Props {
    children: React.ReactNode;
    title?: string;
    description?: string;
    error?: string | null;
}

export default function LoginLayout({ children, title, description, error }: Props) {
    return (
        <div className="loginLayoutContainer">
            <TopDragBar />
            <div className="loginLayoutForm">
                <img src={logoVertical} alt="Sayso" style={{ display: 'block', margin: '20px auto', height: 100 }} />
                {title && <h2>{title}</h2>}
                {description && <p className="loginLayoutDescription">{description}</p>}
                {error && <div className="errorMessage">{error}</div>}
                {children}
            </div>
        </div>
    )
}