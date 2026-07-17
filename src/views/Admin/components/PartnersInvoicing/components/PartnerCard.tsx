import { ReceiptText } from 'lucide-react';
import { Partner } from '../types';
import PartnerCardHeader from './PartnerCardHeader';
import PartnerStats from './PartnerStats';
import PartnerInvitations from './PartnerInvitations';
import '../styles/PartnerCard.css';

interface Props {
    partner: Partner;
    expanded: boolean;
    onToggle: () => void;
    onViewInvoices: () => void;
}

export default function PartnerCard({ partner, expanded, onToggle, onViewInvoices }: Props) {
    const {invitations, netTerms, id} = partner || {};
    return (
        <div className={`partner-card${expanded ? ' partner-card--expanded' : ''}`}>
            <PartnerCardHeader partner={partner} expanded={expanded} onToggle={onToggle} />
            <PartnerStats invitations={invitations} netTerms={netTerms} />
            <div className="partner-card__actions">
                <button type="button" className="partner-card__invoices-button" onClick={onViewInvoices}>
                    <ReceiptText size={15} strokeWidth={2.2} />
                    View invoices
                </button>
            </div>
            {expanded && (
                <PartnerInvitations invitations={invitations} partnerId={id} />
            )}
        </div>
    );
}
