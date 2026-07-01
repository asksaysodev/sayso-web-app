import { usePartners } from './hooks/usePartners';
import { useExpandedRows } from './hooks/useExpandedRows';
import PartnersHeader from './components/PartnersHeader';
import PartnersList from './components/PartnersList';
import PartnersLoadingState from './components/PartnersLoadingState';
import PartnersEmptyState from './components/PartnersEmptyState';
import './styles/PartnersInvoicing.css';

export default function PartnersInvoicing() {
    const { partners, isLoading, isEmpty } = usePartners();
    const { isExpanded, toggle } = useExpandedRows();

    return (
        <div className="partners-invoicing">
            <PartnersHeader count={isLoading ? undefined : partners.length} />
            {isLoading && <PartnersLoadingState />}
            {isEmpty && <PartnersEmptyState />}
            {!isLoading && !isEmpty && (
                <PartnersList
                    partners={partners}
                    isExpanded={isExpanded}
                    onToggle={toggle}
                />
            )}
        </div>
    );
}
