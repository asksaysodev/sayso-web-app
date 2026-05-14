import { LuTriangleAlert } from 'react-icons/lu';
import SaysoButton from '@/components/SaysoButton';

interface Props {
    onRetry: () => void;
}

export default function MarketplaceError({ onRetry }: Props) {
    return (
        <div className="marketplace-error">
            <LuTriangleAlert className="marketplace-error-icon" />
            <h3 className="marketplace-error-title">Couldn't load marketplace</h3>
            <p className="marketplace-error-text">Something went wrong. Please try again.</p>
            <SaysoButton
                label="Reload"
                onClick={onRetry}
                variant="sayso-indigo"
            />
        </div>
    );
}
