import { AlertTriangle } from 'lucide-react';
import SaysoButton from '@/components/SaysoButton';
import '../styles/PartnersErrorState.css';

interface Props {
    onRetry: () => void;
    isRetrying: boolean;
}

export default function PartnersErrorState({ onRetry, isRetrying }: Props) {
    return (
        <div className="partners-error-state">
            <div className="partners-error-state__icon-wrap">
                <AlertTriangle size={26} strokeWidth={1.8} />
            </div>
            <span className="partners-error-state__title">Couldn't load partners.</span>
            <span className="partners-error-state__subtitle">
                Something went wrong fetching the partner list. This is not the same as having no partners — try again.
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
