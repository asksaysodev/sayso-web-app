import { InvitationStatus } from '../types';
import { invitationStatusTone } from '../helpers/invitationStatusTone';
import { formatInvitationStatusLabel } from '../helpers/formatStatusLabel';
import '../styles/InvitationStatusBadge.css';

interface Props {
    status: InvitationStatus;
}

export default function InvitationStatusBadge({ status }: Props) {
    const tone = invitationStatusTone(status);
    return (
        <span className={`invitation-status-badge invitation-status-badge--${tone}`}>
            <span className="invitation-status-badge__dot" />
            {formatInvitationStatusLabel(status)}
        </span>
    );
}
