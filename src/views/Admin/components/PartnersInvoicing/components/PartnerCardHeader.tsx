import { ChevronRight } from 'lucide-react';
import { Partner } from '../types';
import StripeStatusBadge from './StripeStatusBadge';
import '../styles/PartnerCardHeader.css';

interface Props {
    partner: Partner;
    expanded: boolean;
    onToggle: () => void;
}

export default function PartnerCardHeader({ partner, expanded, onToggle }: Props) {
    return (
        <div className="partner-card-header" onClick={onToggle}>
            <div className="partner-card-header__mono">
                {partner.name[0].toUpperCase()}
            </div>
            <div className="partner-card-header__info">
                <span className="partner-card-header__name">{partner.name}</span>
                <span className="partner-card-header__email">{partner.billingEmail}</span>
            </div>
            <div className="partner-card-header__right">
                <StripeStatusBadge status={partner.stripeStatus} />
                <ChevronRight
                    size={18}
                    strokeWidth={2.4}
                    className={`partner-card-header__caret${expanded ? ' partner-card-header__caret--expanded' : ''}`}
                />
            </div>
        </div>
    );
}
