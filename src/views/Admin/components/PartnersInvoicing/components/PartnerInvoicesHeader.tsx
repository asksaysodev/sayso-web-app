import { ExternalLink } from 'lucide-react';
import { Partner } from '../types';
import StripeStatusBadge from './StripeStatusBadge';
import PartnerIdentity from './PartnerIdentity';
import { openExternal } from '@/utils/helpers/openExternal';
import '../styles/PartnerInvoicesHeader.css';

interface Props {
    partner: Partner;
    stripeCustomerUrl: string | null;
}

export default function PartnerInvoicesHeader({ partner, stripeCustomerUrl }: Props) {
    const { name, billingEmail, netTerms, stripeStatus } = partner;

    return (
        <div className="partner-invoices-header">
            <PartnerIdentity
                name={name}
                subtitle={`${billingEmail} · Net ${netTerms}`}
                trailing={<StripeStatusBadge status={stripeStatus} />}
            />
            {stripeCustomerUrl && (
                <button
                    type="button"
                    className="partner-invoices-header__stripe-link"
                    onClick={() => openExternal(stripeCustomerUrl)}
                >
                    <ExternalLink size={15} strokeWidth={2} />
                    Open in Stripe
                </button>
            )}
        </div>
    );
}
