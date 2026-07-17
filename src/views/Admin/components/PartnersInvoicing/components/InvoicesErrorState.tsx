import { AlertTriangle } from 'lucide-react';
import SaysoButton from '@/components/SaysoButton';
import '../styles/InvoicesErrorState.css';

interface Props {
    onRetry: () => void;
    isRetrying: boolean;
}

export default function InvoicesErrorState({ onRetry, isRetrying }: Props) {
    return (
        <div className="invoices-error-state">
            <div className="invoices-error-state__icon-wrap">
                <AlertTriangle size={26} strokeWidth={1.8} />
            </div>
            <span className="invoices-error-state__title">Couldn't load invoices.</span>
            <span className="invoices-error-state__subtitle">
                Something went wrong fetching this partner's invoices from Stripe — try again.
            </span>
            <SaysoButton
                label="Try again"
                variant="outlined"
                size="sm"
                onClick={() => onRetry()}
                loading={isRetrying}
                loadingLabel="Retrying..."
            />
        </div>
    );
}
