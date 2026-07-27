import { PartnerInvoice } from '../types';
import InvoicesTable from './InvoicesTable';
import InvoicesLoadingState from './InvoicesLoadingState';
import InvoicesErrorState from './InvoicesErrorState';
import InvoicesEmptyState from './InvoicesEmptyState';
import '../styles/InvoicesCard.css';

interface Props {
    partnerId: string;
    invoices: PartnerInvoice[];
    isLoading: boolean;
    isError: boolean;
    isRetrying: boolean;
    onRetry: () => void;
}

export default function InvoicesCard({ partnerId, invoices, isLoading, isError, isRetrying, onRetry }: Props) {
    const count = invoices.length;
    const showContent = !isLoading && !isError;

    return (
        <div className="invoices-card">
            <div className="invoices-card__header">
                <h2 className="invoices-card__title">Invoices</h2>
                {showContent && (
                    <span className="invoices-card__count">
                        {count} {count === 1 ? 'invoice' : 'invoices'}
                    </span>
                )}
            </div>
            {isLoading && <InvoicesLoadingState />}
            {isError && <InvoicesErrorState onRetry={onRetry} isRetrying={isRetrying} />}
            {showContent && count === 0 && <InvoicesEmptyState />}
            {showContent && count > 0 && <InvoicesTable partnerId={partnerId} invoices={invoices} />}
        </div>
    );
}
