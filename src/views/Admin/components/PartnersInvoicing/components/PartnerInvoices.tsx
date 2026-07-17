import { ChevronLeft } from 'lucide-react';
import { Partner } from '../types';
import { usePartnerInvoices } from '../hooks/usePartnerInvoices';
import PartnerInvoicesHeader from './PartnerInvoicesHeader';
import PartnerInvoiceStats from './PartnerInvoiceStats';
import InvoicesCard from './InvoicesCard';
import '../styles/PartnerInvoices.css';

interface Props {
    partner: Partner;
    onBack: () => void;
}

export default function PartnerInvoices({ partner, onBack }: Props) {
    const { invoices, stripeCustomerUrl, isLoading, isError, isRetrying, retry } = usePartnerInvoices(partner.id);

    return (
        <div className="partner-invoices">
            <button type="button" className="partner-invoices__back" onClick={onBack}>
                <ChevronLeft size={16} strokeWidth={2.2} />
                Back to partners
            </button>

            <PartnerInvoicesHeader partner={partner} stripeCustomerUrl={stripeCustomerUrl} />

            {!isLoading && !isError && <PartnerInvoiceStats invoices={invoices} />}

            <InvoicesCard
                partnerId={partner.id}
                invoices={invoices}
                isLoading={isLoading}
                isError={isError}
                isRetrying={isRetrying}
                onRetry={retry}
            />
        </div>
    );
}
