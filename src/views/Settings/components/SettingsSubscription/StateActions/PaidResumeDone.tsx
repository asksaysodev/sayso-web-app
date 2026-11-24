import { useState } from 'react';
import { Button } from '@/components/ds/Button';
import Notice from '../RetentionFlow/Notice';
import { formatBill, planHours, priceOn, renewalAfter, todayBill } from '../planState';
import { type ActiveSubscription, formatBillingDate } from '../utils';
import StateActionLayout from './StateActionLayout';

interface Props {
    subscription: ActiveSubscription;
    renewsAt: string | null;
    isRefilled: boolean;
    onClose: () => void;
}

export default function PaidResumeDone({ subscription, renewsAt, isRefilled, onClose }: Props) {
    const [charge] = useState(() => todayBill(subscription));
    const renewal = renewsAt
        ? { date: renewsAt, price: priceOn(subscription, renewsAt) }
        : renewalAfter(subscription, charge.date);
    const hours = planHours(subscription);
    const isSameYear = charge.date.slice(0, 4) === renewal.date.slice(0, 4);

    return (
        <StateActionLayout
            title='Your subscription is active'
            description={
                isRefilled
                    ? 'Payment is confirmed and Cue is back on. Your hours have refilled for the new billing cycle.'
                    : 'Payment is confirmed. Cue and your hours will be back in a moment.'
            }
            rows={[
                { label: 'Charged', value: formatBill(charge) },
                ...(hours
                    ? [{ label: isRefilled ? 'Hours refilled' : 'Hours refilling', value: `${hours} · ${formatBillingDate(charge.date)}` }]
                    : []),
                { label: 'Next renewal', value: formatBill(renewal) },
            ]}
            footer={<Button onClick={onClose}>Back to subscription</Button>}
        >
            <Notice tone='success' role='status'>
                New cycle: {formatBillingDate(charge.date, isSameYear ? 'MMM D' : undefined)} – {formatBillingDate(renewal.date)}.
            </Notice>
        </StateActionLayout>
    );
}
