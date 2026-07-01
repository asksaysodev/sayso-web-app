import { Building2 } from 'lucide-react';
import '../styles/PartnersEmptyState.css';

export default function PartnersEmptyState() {
    return (
        <div className="partners-empty-state">
            <div className="partners-empty-state__icon-wrap">
                <Building2 size={26} strokeWidth={1.8} />
            </div>
            <span className="partners-empty-state__title">No partners yet.</span>
            <span className="partners-empty-state__subtitle">
                Partners you invoice for funded subscriptions will appear here.
            </span>
        </div>
    );
}
