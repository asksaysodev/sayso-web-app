import { type ActiveSubscription, formatBillingDate, formatDollars, formatPriceWithInterval } from './utils';
import './PlanDiscount.css';

interface Props {
    discount: ActiveSubscription['discount'];
    interval: string | null;
}

export default function PlanDiscount({ discount, interval }: Props) {
    const { percentOff, discountedPrice, standardPrice, fullPriceFrom } = discount;
    if (discountedPrice === null || standardPrice === null) return null;

    const standard = formatPriceWithInterval(standardPrice, interval);
    const fullPriceDate = fullPriceFrom && formatBillingDate(fullPriceFrom);

    return (
        <div className='plan-discount'>
            <p className='plan-discount__price'>
                <strong>{formatDollars(discountedPrice)}</strong>
                {interval && ` / ${interval}`} · Standard price {standard}
            </p>
            {fullPriceDate && percentOff !== null && (
                <p className='plan-card__meta'>
                    {percentOff}% off until {fullPriceDate}; {standard} from {fullPriceDate}
                </p>
            )}
        </div>
    );
}
