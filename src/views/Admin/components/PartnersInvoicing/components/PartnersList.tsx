import { Partner } from '../types';
import PartnerCard from './PartnerCard';
import '../styles/PartnersList.css';

interface Props {
    partners: Partner[];
    isExpanded: (id: string) => boolean;
    onToggle: (id: string) => void;
}

export default function PartnersList({ partners, isExpanded, onToggle }: Props) {
    return (
        <div className="partners-list">
            {partners.map(partner => (
                <PartnerCard
                    key={partner.id}
                    partner={partner}
                    expanded={isExpanded(partner.id)}
                    onToggle={() => onToggle(partner.id)}
                />
            ))}
        </div>
    );
}
