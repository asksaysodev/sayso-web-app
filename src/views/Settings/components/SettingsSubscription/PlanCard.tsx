import { useMemo } from 'react';
import dayjs from 'dayjs';
import { useQuery } from '@tanstack/react-query';
import { PiSpeedometer } from 'react-icons/pi';
import { Card } from '@/components/ds/Card';
import { Button } from '@/components/ds/Button';
import getAccountUsage from '@/services/getAccountUsage';
import useStripeUpgrade from '@/views/Subscription/hooks/useStripeUpgrade';
import { type ActiveSubscription, formatMoney, planStatus } from './utils';

interface Props {
    subscription: ActiveSubscription;
}

export default function PlanCard({ subscription }: Props) {
    const { mutateUpgradeTrialSubscription, isPendingUpgradeTrialSubscription } = useStripeUpgrade();
    const { data: usage } = useQuery({
        queryKey: ['settings-account-usage'],
        queryFn: getAccountUsage,
    });

    const isTrialing = subscription.status === 'trialing';
    const isCancelling = subscription.status === 'canceled' || !!subscription.cancelledAt;
    const isPartnerFunded = !!subscription.isPartnerFunded;
    const status = planStatus(subscription);

    const renewalDate = subscription.billing?.period?.end
        ? dayjs(subscription.billing.period.end).format('MMM D, YYYY')
        : '';

    const planMinutes = (isTrialing ? subscription.includedMinutes?.trial : subscription.includedMinutes?.plan) ?? 0;
    const billingPeriod = subscription.billing?.cycle === 'month' ? 'Monthly' : 'Yearly';
    const { priceInCents, currency } = subscription.price ?? {};
    const interval = subscription.interval ?? subscription.billing?.cycle;

    const footnote = useMemo(() => {
        if (isPartnerFunded) {
            return subscription.partnerName
                ? `Your subscription is paid by ${subscription.partnerName}.`
                : 'Your subscription is paid by your partner organization.';
        }
        if (!renewalDate) return null;
        if (subscription.status === 'paused') {
            return `Your subscription is paused. Your minutes will expire on ${renewalDate}, but you'll continue to have access to your account.`;
        }
        if (isCancelling) return `You can continue using Sayso until ${renewalDate}.`;
        return `Your subscription renews on ${renewalDate}.`;
    }, [subscription, renewalDate, isCancelling, isPartnerFunded]);

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
                    {priceInCents != null && !isPartnerFunded && (
                        <p className='plan-card__price'>
                            <strong>{formatMoney(priceInCents, currency)}</strong>
                            {interval && <span> / {interval}</span>}
                        </p>
                    )}
                </div>
                <p className='plan-card__meta'>
                    {billingPeriod} · {Math.floor(planMinutes / 60)} hours / month
                </p>
                {isTrialing && (
                    <p className='plan-card__meta'>180 free trial minutes, then 1800 minutes included.</p>
                )}
                {usage && (
                    <p className='plan-card__usage'>
                        <PiSpeedometer size={24} aria-hidden />
                        <span>
                            {`You've used ${usage.usedMinutes} ${usage.usedMinutes === 1 ? 'minute' : 'minutes'} this period`}
                            {usage.periodEnd && `, which ends on ${dayjs(usage.periodEnd).format('MMMM D, YYYY')}`}
                        </span>
                    </p>
                )}
            </div>
            {(footnote || isTrialing) && (
                <div className='plan-card__footer'>
                    {footnote && <p className='plan-card__footnote'>{footnote}</p>}
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
        </Card>
    );
}
