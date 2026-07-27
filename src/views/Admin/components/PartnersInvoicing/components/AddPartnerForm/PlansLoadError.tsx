import { AlertTriangle, RefreshCw } from 'lucide-react';
import './styles/PlansLoadError.css';

interface Props {
    onRetry: () => void;
    isRetrying: boolean;
}

export default function PlansLoadError({ onRetry, isRetrying }: Props) {
    return (
        <div className="plans-load-error">
            <AlertTriangle size={15} className="plans-load-error__icon" strokeWidth={2} />
            <span className="plans-load-error__text">
                Couldn't load plans, so teams can't be funded right now.
            </span>
            <button
                type="button"
                className="plans-load-error__retry"
                onClick={() => onRetry()}
                disabled={isRetrying}
            >
                <RefreshCw size={13} className={isRetrying ? 'plans-load-error__spinner' : undefined} />
                <span>{isRetrying ? 'Retrying…' : 'Retry'}</span>
            </button>
        </div>
    );
}
