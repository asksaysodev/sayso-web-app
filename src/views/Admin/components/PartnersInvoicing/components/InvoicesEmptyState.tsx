import { FileText } from 'lucide-react';
import '../styles/InvoicesEmptyState.css';

export default function InvoicesEmptyState() {
    return (
        <div className="invoices-empty-state">
            <div className="invoices-empty-state__icon-wrap">
                <FileText size={24} strokeWidth={1.7} />
            </div>
            <span className="invoices-empty-state__title">No invoices yet.</span>
            <span className="invoices-empty-state__subtitle">
                Invoices generated in Stripe for this partner will appear here.
            </span>
        </div>
    );
}
