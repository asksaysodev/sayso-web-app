import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { CircleHelp } from 'lucide-react';

import logoHorizontal from '/assets/logo-pos-horizontal.png';
import './styles/authLayout.css';

const SUPPORT_EMAIL = 'support@asksayso.com';

export interface AuthLayoutHeaderLink {
    /** Muted copy before the link, e.g. "Don't have an account?" */
    prompt: string;
    /** Link label, e.g. "Sign up" */
    label: string;
    /** In-app route the link navigates to */
    to: string;
}

interface Props {
    children: ReactNode;
    /** Large view title rendered above the content column (Figma: 40px DM Sans). */
    title?: string;
    /** Prompt + link shown on the right side of the top bar. */
    headerLink?: AuthLayoutHeaderLink;
    /** Left rail next to the content, e.g. the sign-up progress indicator (SAYSO-523). */
    aside?: ReactNode;
}

/**
 * Shared shell for every login and sign-up view: top bar, the single sign-up
 * background glow, the top spacing above the title and the support footer.
 */
export default function AuthLayout({ children, title, headerLink, aside }: Props) {
    return (
        <div className="authLayout">
            <div className="authLayoutGlow" aria-hidden="true" />

            <header className="authLayoutTopBar">
                <Link to="/" className="authLayoutLogo" aria-label="Sayso home">
                    <img src={logoHorizontal} alt="Sayso" />
                </Link>
                {headerLink && (
                    <div className="authLayoutHeaderLink">
                        <span>{headerLink.prompt}</span>
                        <Link to={headerLink.to} className="authLayoutTextLink">
                            {headerLink.label}
                        </Link>
                    </div>
                )}
            </header>

            <main className="authLayoutMain">
                {title && <h1 className="authLayoutTitle">{title}</h1>}
                {aside && <aside className="authLayoutAside">{aside}</aside>}
                <div className="authLayoutContent">{children}</div>
            </main>

            <footer className="authLayoutFooter">
                <span>Need help?</span>
                <a href={`mailto:${SUPPORT_EMAIL}`} className="authLayoutTextLink">
                    Contact Support
                    <CircleHelp size={20} strokeWidth={1.75} aria-hidden="true" />
                </a>
            </footer>
        </div>
    );
}
