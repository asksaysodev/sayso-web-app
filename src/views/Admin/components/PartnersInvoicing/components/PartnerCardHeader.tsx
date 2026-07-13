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
    const { name, billingEmail, stripeStatus } = partner;
    return (
        <button
            type="button"
            className="partner-card-header"
            onClick={onToggle}
            aria-expanded={expanded}
        >
            <div className="partner-card-header__mono">
                {name[0]?.toUpperCase() ?? '?'}
            </div>
            <div className="partner-card-header__info">
                <span className="partner-card-header__name">
                    {name}
                </span>
                <span className="partner-card-header__email">
                    {billingEmail}
                </span>
            </div>
            <div className="partner-card-header__right">
                <StripeStatusBadge status={stripeStatus} />
                <ChevronRight
                    size={18}
                    strokeWidth={2.4}
                    className={`partner-card-header__caret${expanded ? ' partner-card-header__caret--expanded' : ''}`}
                />
            </div>
        </button>
    );
}
