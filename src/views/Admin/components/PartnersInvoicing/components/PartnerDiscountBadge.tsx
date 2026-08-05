import '../styles/PartnerDiscountBadge.css';

interface Props {
    discountPercent: number;
}

export default function PartnerDiscountBadge({ discountPercent }: Props) {
    return (
        <span className="partner-discount-badge">{discountPercent}% off</span>
    );
}
