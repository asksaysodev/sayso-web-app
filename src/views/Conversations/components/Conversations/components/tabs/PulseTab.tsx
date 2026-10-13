import { PiCalendarCheck, PiCurrencyCircleDollar, PiSquareHalf, PiStorefront } from 'react-icons/pi';
import { ConversationPulse } from '@/types/coach';
import TrendIcon from './TrendIcon';

interface Props {
    pulse: ConversationPulse[];
}

export default function PulseTab({ pulse }: Props) {
    const [market] = pulse;

    if (!market) {
        return <div className="conv-tab-empty">No market data available for this conversation.</div>;
    }

    const trendLabel = market.price_trend_change_percent != null
        ? `${Math.abs(market.price_trend_change_percent)}%`
        : market.price_trend_direction ?? '—';

    const stats = [
        { label: 'Average days on market', icon: <PiCalendarCheck size={16} />, value: market.median_days_on_market != null ? `${market.median_days_on_market} days` : '—', trend: null },
        { label: 'Average price / ft²', icon: <PiSquareHalf size={16} />, value: market.median_price_per_sqft != null ? `$${Math.round(market.median_price_per_sqft)}` : '—', trend: null },
        { label: 'Price change', icon: <PiCurrencyCircleDollar size={16} />, value: trendLabel, trend: market.price_trend_direction },
        { label: 'Market type', icon: <PiStorefront size={16} />, value: market.market_dynamics ?? '—', trend: null },
    ];

    return (
        <div className="conv-pulse-grid">
            {stats.map((stat) => (
                <div key={stat.label} className="conv-pulse-card">
                    <div className="conv-pulse-head">
                        {stat.icon}
                        <span className="conv-pulse-label">{stat.label}</span>
                    </div>
                    <div className="conv-pulse-val">
                        {stat.trend && <TrendIcon direction={stat.trend} />}
                        {stat.value}
                    </div>
                </div>
            ))}
        </div>
    );
}
