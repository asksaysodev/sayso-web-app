import { Button } from '@/components/ds/Button';
import type { RetentionDiscount } from '@/views/Subscription/types';
import { formatBillingDate, formatDollars, formatPriceWithInterval, intervalLabel } from '../utils';
import Notice from './Notice';
import StepHeading from './StepHeading';
import StepLayout from './StepLayout';
import SummaryRows from './SummaryRows';

interface Props {
    planName: string;
    interval: string | null;
    discount: RetentionDiscount;
    onClose: () => void;
}

export default function DiscountConfirmed({ planName, interval, discount, onClose }: Props) {
    const { discountedBillDates, discountedPrice, standardPrice, fullPriceFrom } = discount;
    const billing = intervalLabel(interval)?.toLowerCase();
    const bills = [billing, discountedBillDates.length === 1 ? 'bill' : 'bills'].filter(Boolean).join(' ');
    const count = discountedBillDates.length === 1 ? '' : `${discountedBillDates.length} `;
    const standard = formatPriceWithInterval(standardPrice, interval);

    return (
        <StepLayout footer={<Button onClick={onClose}>Confirm</Button>}>
            <StepHeading
                isSuccess
                title={
                    <>
                        Your discount starts
                        <br />
                        {formatBillingDate(discountedBillDates[0])}
                    </>
                }
                description={`Your ${planName} subscription stays active. The discount applies to your next ${count}${bills}.`}
            />
            <SummaryRows
                rows={[
                    ...discountedBillDates.map((date) => ({
                        label: formatBillingDate(date),
                        value: formatDollars(discountedPrice),
                    })),
                    { label: `From ${formatBillingDate(fullPriceFrom)}`, value: standard },
                ]}
            />
            <Notice tone='warning'>
                Standard price: <strong>{standard}.</strong> Your discount details will appear in Subscription.
            </Notice>
        </StepLayout>
    );
}
