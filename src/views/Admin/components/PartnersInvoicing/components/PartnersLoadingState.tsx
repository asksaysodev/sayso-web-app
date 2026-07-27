import { Loader2 } from 'lucide-react';
import '../styles/PartnersLoadingState.css';

export default function PartnersLoadingState() {
    return (
        <div className="partners-loading-state">
            <Loader2 className="partners-loading-state__icon" size={30} strokeWidth={2.2} />
            <span className="partners-loading-state__text">Loading partners…</span>
        </div>
    );
}
