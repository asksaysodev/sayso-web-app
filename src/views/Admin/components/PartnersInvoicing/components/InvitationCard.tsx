import { Invitation } from '../types';
import InvitationStatusBadge from './InvitationStatusBadge';
import { invitationStatusTone } from '../helpers/invitationStatusTone';
import '../styles/InvitationCard.css';

interface Props {
    invitation: Invitation;
}

export default function InvitationCard({ invitation }: Props) {
    const {email, planName, status, teamSize,claimedAt} = invitation || {}
    const tone = invitationStatusTone(status);
    return (
        <div className="invitation-card">
            <div className={`invitation-card__avatar invitation-card__avatar--${tone}`}>
                {email[0]?.toUpperCase() ?? '?'}
            </div>
            <div className="invitation-card__info">
                <span className="invitation-card__email">{email}</span>
                <span className="invitation-card__plan">
                    {planName} · {teamSize}
                </span>
            </div>
            <div className="invitation-card__meta">
                <span className={`invitation-card__date${claimedAt ? '' : ' invitation-card__date--empty'}`}>
                    {claimedAt ?? '—'}
                </span>
                <InvitationStatusBadge status={status} />
            </div>
        </div>
    );
}
