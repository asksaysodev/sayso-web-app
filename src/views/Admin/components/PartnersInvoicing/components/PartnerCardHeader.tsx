import { ChevronRight } from 'lucide-react';
import { Partner } from '../types';
import StripeStatusBadge from './StripeStatusBadge';
import PartnerDiscountBadge from './PartnerDiscountBadge';
import PartnerIdentity from './PartnerIdentity';
import '../styles/PartnerCardHeader.css';

interface Props {
    partner: Partner;
    expanded: boolean;
    onToggle: () => void;
}

export default function PartnerCardHeader({ partner, expanded, onToggle }: Props) {
    const { name, billingEmail, stripeStatus, discountPercent } = partner;
    return (
        <button
            type="button"
            className="partner-card-header"
            onClick={onToggle}
            aria-expanded={expanded}
        >
            <PartnerIdentity name={name} subtitle={billingEmail} />
            <div className="partner-card-header__right">
                {discountPercent != null && <PartnerDiscountBadge discountPercent={discountPercent} />}
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
