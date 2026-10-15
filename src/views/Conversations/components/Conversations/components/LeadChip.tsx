import clsx from 'clsx';
import { LeadType } from '@/types/coach';

interface Props {
    type: LeadType | null;
}

export default function LeadChip({ type }: Props) {
    if (!type) return null;
    return (
        <span className={clsx('conv-lead-chip', type === 'seller' && 'conv-lead-chip--seller')}>
            {type}
        </span>
    );
}
