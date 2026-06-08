import { LeadType } from '@/types/coach';

interface Props {
    type: LeadType | null;
}

export default function LeadChip({ type }: Props) {
    if (!type) return null;
    const isSeller = type === 'seller';
    return (
        <span
            className="conv-lead-chip"
            style={{
                color: isSeller ? '#b4530a' : 'var(--sayso-indigo)',
                background: isSeller ? '#fdf1e7' : '#F2F5FF',
            }}
        >
            {isSeller ? 'Seller' : 'Buyer'}
        </span>
    );
}
