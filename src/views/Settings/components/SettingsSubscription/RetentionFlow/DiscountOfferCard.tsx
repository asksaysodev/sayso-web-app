import type { RetentionDiscount } from '@/views/Subscription/types';
import { formatBillDates, formatBillingDate, formatDollars, formatPriceWithInterval, intervalLabel } from '../utils';
import './DiscountOfferCard.css';

interface Props {
    planName: string;
    interval: string | null;
    discount: RetentionDiscount;
}

export default function DiscountOfferCard({ planName, interval, discount }: Props) {
    const { percentOff, discountedPrice, standardPrice, discountedBillDates, fullPriceFrom } = discount;
    const billing = intervalLabel(interval);
    const standard = formatPriceWithInterval(standardPrice, interval);

    return (
        <div className='discount-offer'>
            <div className='discount-offer__header'>
                <p className='discount-offer__plan'>{billing ? `${planName} · ${billing}` : planName}</p>
                <span className='discount-offer__badge'>
                    {percentOff}% OFF · {discountedBillDates.length} {discountedBillDates.length === 1 ? 'CYCLE' : 'CYCLES'}
                </span>
            </div>
            <p className='discount-offer__price'>
                <strong>{formatDollars(discountedPrice)}</strong>
                {interval && ` / ${interval}`}
            </p>
            <p className='discount-offer__standard'>Standard price: {standard}</p>
            <p className='discount-offer__dates'>
                {formatDollars(discountedPrice)} on {formatBillDates(discountedBillDates)}.
                <br />
                {standard} from {formatBillingDate(fullPriceFrom)}.
            </p>
        </div>
    );
}
