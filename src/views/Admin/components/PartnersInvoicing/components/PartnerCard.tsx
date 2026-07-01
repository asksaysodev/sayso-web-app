import { Partner } from '../types';
import PartnerCardHeader from './PartnerCardHeader';
import PartnerStats from './PartnerStats';
import PartnerInvitations from './PartnerInvitations';
import '../styles/PartnerCard.css';

interface Props {
    partner: Partner;
    expanded: boolean;
    onToggle: () => void;
}

export default function PartnerCard({ partner, expanded, onToggle }: Props) {
    const {invitations, netTerms, id} = partner || {};
    return (
        <div className={`partner-card${expanded ? ' partner-card--expanded' : ''}`}>
            <PartnerCardHeader partner={partner} expanded={expanded} onToggle={onToggle} />
            <PartnerStats invitations={invitations} netTerms={netTerms} />
            {expanded && (
                <PartnerInvitations invitations={invitations} partnerId={id} />
            )}
        </div>
    );
}
