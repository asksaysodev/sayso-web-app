import { LuArrowUp, LuArrowDown, LuMinus, LuMapPin } from 'react-icons/lu';
import { ConversationPulse } from '@/types/coach';

interface Props {
    pulse: ConversationPulse[];
}

function TrendIcon({ direction }: { direction: string | null }) {
    const dir = direction?.toLowerCase();
    if (dir === 'up' || dir === 'rising' || dir === 'increasing') return <LuArrowUp size={14} color="#16a34a" />;
    if (dir === 'down' || dir === 'falling' || dir === 'decreasing') return <LuArrowDown size={14} color="#dc2626" />;
    return <LuMinus size={14} color="var(--sayso-lightgray)" />;
}

export default function PulseTab({ pulse }: Props) {
    const p = pulse[0];

    if (!p) {
        return <div className="conv-pulse-empty">No market data available for this conversation.</div>;
    }

    const location = [p.city, p.state].filter(Boolean).join(', ');
    const trendLabel = p.price_trend_change_percent != null
        ? `${p.price_trend_change_percent > 0 ? '+' : ''}${p.price_trend_change_percent}%`
        : p.price_trend_direction ?? '—';

    const stats = [
        { label: 'Avg days on market', value: p.median_days_on_market != null ? `${p.median_days_on_market} days` : '—', trend: null },
        { label: 'Avg price / ft²',    value: p.median_price_per_sqft  != null ? `$${Math.round(p.median_price_per_sqft)}` : '—', trend: null },
        { label: 'Price trend',        value: trendLabel, trend: p.price_trend_direction },
        { label: 'Market',             value: p.market_dynamics ?? '—', trend: null },
    ];

    return (
        <div>
            {location && (
                <div className="conv-pulse-loc">
                    <LuMapPin size={15} color="var(--sayso-lightgray)" />
                    {location}{p.zip_code ? ` · ${p.zip_code}` : ''}
                </div>
            )}
            <div className="conv-pulse-grid">
                {stats.map((s, i) => (
                    <div key={i} className="conv-pulse-card">
                        <div className="conv-pulse-label">{s.label}</div>
                        <div className="conv-pulse-val">
                            {s.trend && <TrendIcon direction={s.trend} />}
                            {s.value}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
