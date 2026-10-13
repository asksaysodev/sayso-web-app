import { LuMapPin } from 'react-icons/lu';
import { ConversationPulse } from '@/types/coach';
import TrendIcon from './TrendIcon';

interface Props {
    pulse: ConversationPulse[];
}

export default function PulseTab({ pulse }: Props) {
    const [market] = pulse;

    if (!market) {
        return <div className="conv-pulse-empty">No market data available for this conversation.</div>;
    }

    const location = [market.city, market.state].filter(Boolean).join(', ');
    const trendLabel = market.price_trend_change_percent != null
        ? `${market.price_trend_change_percent > 0 ? '+' : ''}${market.price_trend_change_percent}%`
        : market.price_trend_direction ?? '—';

    const stats = [
        { label: 'Avg days on market', value: market.median_days_on_market != null ? `${market.median_days_on_market} days` : '—', trend: null },
        { label: 'Avg price / ft²', value: market.median_price_per_sqft != null ? `$${Math.round(market.median_price_per_sqft)}` : '—', trend: null },
        { label: 'Price trend', value: trendLabel, trend: market.price_trend_direction },
        { label: 'Market', value: market.market_dynamics ?? '—', trend: null },
    ];

    return (
        <div>
            {location && (
                <div className="conv-pulse-loc">
                    <LuMapPin size={15} color="var(--sayso-lightgray)" />
                    {location}{market.zip_code ? ` · ${market.zip_code}` : ''}
                </div>
            )}
            <div className="conv-pulse-grid">
                {stats.map((stat) => (
                    <div key={stat.label} className="conv-pulse-card">
                        <div className="conv-pulse-label">{stat.label}</div>
                        <div className="conv-pulse-val">
                            {stat.trend && <TrendIcon direction={stat.trend} />}
                            {stat.value}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
