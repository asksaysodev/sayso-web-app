import { useMemo } from 'react';
import { Card } from '@/components/ds/Card';
import { Button } from '@/components/ds/Button';
import useStripeUpgrade from '@/views/Subscription/hooks/useStripeUpgrade';
import PlanUsage from './PlanUsage';
import { type ActiveSubscription, formatBillingDate, planStatus } from './utils';

interface Props {
    subscription: ActiveSubscription;
}

export default function PlanCard({ subscription }: Props) {
    const { mutateUpgradeTrialSubscription, isPendingUpgradeTrialSubscription } = useStripeUpgrade();

    const isTrialing = subscription.status === 'trialing';
    const isPartnerFunded = !!subscription.isPartnerFunded;
    const status = planStatus(subscription);

    const renewalDate = subscription.billing?.period?.end
        ? formatBillingDate(subscription.billing.period.end)
        : '';

    const planMinutes = (isTrialing ? subscription.includedMinutes?.trial : subscription.includedMinutes?.plan) ?? 0;
    const billingPeriod = subscription.billing?.cycle === 'month' ? 'Monthly' : 'Yearly';

    const footnote = useMemo(() => {
        if (isPartnerFunded) {
            return subscription.partnerName
                ? `Your subscription is paid by ${subscription.partnerName}.`
                : 'Your subscription is paid by your partner organization.';
        }
        if (!renewalDate) return null;
        if (subscription.status === 'canceled') return `You can continue using Sayso until ${renewalDate}.`;
        return `Your subscription renews on ${renewalDate}.`;
    }, [subscription, renewalDate, isPartnerFunded]);

    return (
        <Card className='subscription-card plan-card'>
            <div className='plan-card__summary'>
                <div className='plan-card__top'>
                    <div className='plan-card__name'>
                        <h2>{subscription.name}</h2>
                        <span className='plan-card__status'>
                            <span className={`plan-card__status-dot plan-card__status-dot--${status.tone}`} aria-hidden />
                            {status.label}
                        </span>
                    </div>
                </div>
                <p className='plan-card__meta'>
                    {billingPeriod} · {Math.floor(planMinutes / 60)} hours / month
                </p>
                {isTrialing && (
                    <p className='plan-card__meta'>180 free trial minutes, then 1800 minutes included.</p>
                )}
                {(footnote || isTrialing) && (
                    <div className='plan-card__footer'>
                        {footnote && <p className='plan-card__meta'>{footnote}</p>}
                        {isTrialing && (
                            <Button
                                variant='secondary'
                                size='sm'
                                onClick={() => mutateUpgradeTrialSubscription()}
                                loading={isPendingUpgradeTrialSubscription}
                            >
                                Upgrade to paid account
                            </Button>
                        )}
                    </div>
                )}
            </div>
            <PlanUsage />
        </Card>
    );
}
