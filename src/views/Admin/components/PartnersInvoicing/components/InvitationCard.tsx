import { Invitation } from '../types';
import InvitationStatusBadge from './InvitationStatusBadge';
import { invitationStatusTone } from '../helpers/invitationStatusTone';
import '../styles/InvitationCard.css';

interface Props {
    invitation: Invitation;
}

export default function InvitationCard({ invitation }: Props) {
    const tone = invitationStatusTone(invitation.status);

    return (
        <div className="invitation-card">
            <div className={`invitation-card__avatar invitation-card__avatar--${tone}`}>
                {invitation.email[0].toUpperCase()}
            </div>
            <div className="invitation-card__info">
                <span className="invitation-card__email">{invitation.email}</span>
                <span className="invitation-card__plan">
                    {invitation.planName} · {invitation.teamSize}
                </span>
            </div>
            <div className="invitation-card__meta">
                <span className={`invitation-card__date${invitation.claimedAt ? '' : ' invitation-card__date--empty'}`}>
                    {invitation.claimedAt ?? '—'}
                </span>
                <InvitationStatusBadge status={invitation.status} />
            </div>
        </div>
    );
}
