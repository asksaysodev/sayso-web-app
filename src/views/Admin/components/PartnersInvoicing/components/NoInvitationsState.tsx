import { Mail } from 'lucide-react';
import '../styles/NoInvitationsState.css';

export default function NoInvitationsState() {
    return (
        <div className="no-invitations-state">
            <Mail size={22} strokeWidth={1.8} className="no-invitations-state__icon" />
            <span className="no-invitations-state__text">No invitations for this partner.</span>
        </div>
    );
}
