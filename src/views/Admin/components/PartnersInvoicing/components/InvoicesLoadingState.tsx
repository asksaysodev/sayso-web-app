import { Loader2 } from 'lucide-react';
import '../styles/InvoicesLoadingState.css';

export default function InvoicesLoadingState() {
    return (
        <div className="invoices-loading-state">
            <Loader2 className="invoices-loading-state__icon" size={30} strokeWidth={2.2} />
            <span className="invoices-loading-state__text">Loading invoices…</span>
        </div>
    );
}
