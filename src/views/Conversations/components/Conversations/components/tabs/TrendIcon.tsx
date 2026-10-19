import { PiMinus, PiTrendDown, PiTrendUp } from 'react-icons/pi';

interface Props {
    direction: string | null;
}

export default function TrendIcon({ direction }: Props) {
    const dir = direction?.toLowerCase();
    if (dir === 'up' || dir === 'rising' || dir === 'increasing') return <PiTrendUp size={20} color="var(--success-icon)" />;
    if (dir === 'down' || dir === 'falling' || dir === 'decreasing') return <PiTrendDown size={20} color="var(--error-icon)" />;
    return <PiMinus size={20} color="var(--text-secondary)" />;
}
