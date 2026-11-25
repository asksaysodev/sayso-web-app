import { useState } from 'react';
import { Button } from '@/components/ds/Button';
import Notice from '../RetentionFlow/Notice';
import { billAfterRemovingPause, formatBill, formatBillSentence, priceOn } from '../planState';
import { type ActiveSubscription, formatBillingDate } from '../utils';
import StateActionLayout from './StateActionLayout';

interface Props {
    subscription: ActiveSubscription;
    renewsAt: string | null;
    onClose: () => void;
}

export default function RemovePauseDone({ subscription, renewsAt, onClose }: Props) {
    const [today] = useState(() => formatBillingDate(new Date().toISOString()));
    const bill = renewsAt
        ? { date: renewsAt, price: priceOn(subscription, renewsAt) }
        : billAfterRemovingPause(subscription);

    return (
        <StateActionLayout
            title='Scheduled pause removed'
            description={`Full access continues.${bill ? ` Your next bill is ${formatBillSentence(bill)}.` : ''}`}
            rows={[
                { label: 'Charged today', value: `$0 · ${today}` },
                ...(bill ? [{ label: 'Next renewal', value: formatBill(bill) }] : []),
            ]}
            footer={<Button onClick={onClose}>Back to subscription</Button>}
        >
            <Notice tone='success' role='status'>No charge today. Your original renewal date is unchanged.</Notice>
        </StateActionLayout>
    );
}
