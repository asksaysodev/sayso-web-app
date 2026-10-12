import { LuArrowUp, LuArrowDown, LuMinus } from 'react-icons/lu';

interface Props {
    direction: string | null;
}

export default function TrendIcon({ direction }: Props) {
    const dir = direction?.toLowerCase();
    if (dir === 'up' || dir === 'rising' || dir === 'increasing') return <LuArrowUp size={14} color="#16a34a" />;
    if (dir === 'down' || dir === 'falling' || dir === 'decreasing') return <LuArrowDown size={14} color="#dc2626" />;
    return <LuMinus size={14} color="var(--sayso-lightgray)" />;
}
