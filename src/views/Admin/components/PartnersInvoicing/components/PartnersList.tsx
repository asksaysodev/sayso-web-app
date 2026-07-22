import { Partner } from '../types';
import PartnerCard from './PartnerCard';
import '../styles/PartnersList.css';

interface Props {
    partners: Partner[];
    isExpanded: (id: string) => boolean;
    onToggle: (id: string) => void;
    onViewInvoices: (partner: Partner) => void;
}

export default function PartnersList({ partners, isExpanded, onToggle, onViewInvoices }: Props) {
    return (
        <div className="partners-list">
            {partners.map(partner => {
                const {id} = partner || {};
                return (
                    <PartnerCard
                        key={id}
                        partner={partner}
                        expanded={isExpanded(id)}
                        onToggle={() => onToggle(id)}
                        onViewInvoices={() => onViewInvoices(partner)}
                    />
                );
            })}
        </div>
    );
}
