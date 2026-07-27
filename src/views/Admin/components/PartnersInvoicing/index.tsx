import { useState } from 'react';
import { Partner } from './types';
import { usePartners } from './hooks/usePartners';
import { useExpandedRows } from './hooks/useExpandedRows';
import PartnersHeader from './components/PartnersHeader';
import PartnersList from './components/PartnersList';
import PartnersLoadingState from './components/PartnersLoadingState';
import PartnersEmptyState from './components/PartnersEmptyState';
import PartnersErrorState from './components/PartnersErrorState';
import PartnerInvoices from './components/PartnerInvoices';
import './styles/PartnersInvoicing.css';

export default function PartnersInvoicing() {
    const { partners, isLoading, isError, isRetrying, retry, isEmpty } = usePartners();
    const { isExpanded, toggle } = useExpandedRows();
    const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

    if (selectedPartner) {
        return (
            <PartnerInvoices
                partner={selectedPartner}
                onBack={() => setSelectedPartner(null)}
            />
        );
    }

    return (
        <div className="partners-invoicing">
            <PartnersHeader count={isLoading || isError ? undefined : partners.length} />
            {isLoading && <PartnersLoadingState />}
            {isError && <PartnersErrorState onRetry={retry} isRetrying={isRetrying} />}
            {isEmpty && <PartnersEmptyState />}
            {!isLoading && !isError && !isEmpty && (
                <PartnersList
                    partners={partners}
                    isExpanded={isExpanded}
                    onToggle={toggle}
                    onViewInvoices={setSelectedPartner}
                />
            )}
        </div>
    );
}
