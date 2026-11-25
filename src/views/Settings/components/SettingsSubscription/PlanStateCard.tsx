import { Button } from '@/components/ds/Button';
import PlanStateLayout from './PlanStateLayout';
import type { SummaryRow } from './RetentionFlow/SummaryRows';
import {
    canResume,
    formatBillSentence,
    intervalOf,
    type PlanState,
    planLabel,
    renewalAfter,
    todayBill,
} from './planState';
import { type ActiveSubscription, formatBillingDate, formatPriceWithInterval } from './utils';

interface Props {
    subscription: ActiveSubscription;
    state: Exclude<PlanState, 'normal'>;
    onResume: () => void;
}

interface Content {
    title: string;
    status: string;
    tone: 'info' | 'primary';
    description: string;
    facts: SummaryRow[];
    note?: string;
}

const cancellingContent = (subscription: ActiveSubscription): Content => {
    const { accessEndsAt } = subscription.cancellation;
    const endDate = accessEndsAt && formatBillingDate(accessEndsAt);
    const period = subscription.status === 'trialing' ? 'trial' : 'paid period';
    return {
        title: endDate ? `Full access until ${endDate}` : 'Your renewal is canceled',
        status: 'Cancellation pending',
        tone: 'info',
        description: endDate
            ? `Your renewal is canceled. You still have full access until your ${period} ends.`
            : 'Your subscription will not renew.',
        facts: [
            ...(endDate ? [{ label: 'Access ends', value: endDate }] : []),
            { label: 'Current plan', value: planLabel(subscription) },
        ],
    };
};

const pauseFacts = (subscription: ActiveSubscription, startLabel: string): SummaryRow[] => {
    const { startsAt, resumesAt, priceOnReturn } = subscription.pause;
    return [
        ...(startsAt ? [{ label: startLabel, value: formatBillingDate(startsAt) }] : []),
        ...(resumesAt ? [{ label: 'Auto-resumes', value: formatBillingDate(resumesAt) }] : []),
        ...(priceOnReturn !== null
            ? [{ label: 'Price on return', value: formatPriceWithInterval(priceOnReturn, intervalOf(subscription)) }]
            : []),
    ];
};

const scheduledContent = (subscription: ActiveSubscription): Content => {
    const { startsAt } = subscription.pause;
    return {
        title: startsAt ? `Full access until ${formatBillingDate(startsAt)}` : 'Pause scheduled',
        status: 'Pause scheduled',
        tone: 'primary',
        description: 'Your pause starts after your paid period ends. Keep using Cue and the web app until then.',
        facts: pauseFacts(subscription, 'Pause begins'),
        note: 'Remove the scheduled pause. No charge today; your renewal date stays the same.',
    };
};

const pausedContent = (subscription: ActiveSubscription): Content => {
    const { resumesAt } = subscription.pause;
    const today = todayBill(subscription);
    const renewal = renewalAfter(subscription, today.date);
    return {
        title: resumesAt ? `Paused until ${formatBillingDate(resumesAt)}` : 'Your subscription is paused',
        status: 'Paused',
        tone: 'primary',
        description: 'Access to Cue and billing are paused. You can still use the web app.',
        facts: pauseFacts(subscription, 'Pause began'),
        note: `Resuming starts a new cycle today: ${formatBillSentence(today)}; hours refill today; next renewal ${formatBillingDate(renewal.date)}.`,
    };
};

const CONTENT = {
    cancelling: cancellingContent,
    'pause-scheduled': scheduledContent,
    paused: pausedContent,
};

export default function PlanStateCard({ subscription, state, onResume }: Props) {
    const { title, status, tone, description, facts, note } = CONTENT[state](subscription);
    const showResume = state !== 'cancelling' && canResume(subscription);

    return (
        <PlanStateLayout title={title} plan={planLabel(subscription)} status={{ label: status, tone }} description={description} facts={facts}>
            {showResume && (
                <>
                    <Button className='plan-state-card__action' onClick={onResume}>
                        Resume now
                    </Button>
                    {note && <p className='plan-state-card__note'>{note}</p>}
                </>
            )}
        </PlanStateLayout>
    );
}
