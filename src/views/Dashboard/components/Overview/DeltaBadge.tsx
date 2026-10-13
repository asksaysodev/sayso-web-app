import { TrendingDown, TrendingUp } from 'lucide-react';
import clsx from 'clsx';

interface Props {
    delta: number;
    comparison: string;
}

export default function DeltaBadge({ delta, comparison }: Props) {
    if (delta === 0) return null;

    const isUp = delta > 0;
    const Icon = isUp ? TrendingUp : TrendingDown;

    return (
        <span className={clsx('dashboard-delta-badge', isUp ? 'dashboard-delta-badge--up' : 'dashboard-delta-badge--down')}>
            <Icon size={12} />
            {isUp ? '+' : ''}
            {delta} vs. {comparison}
        </span>
    );
}
