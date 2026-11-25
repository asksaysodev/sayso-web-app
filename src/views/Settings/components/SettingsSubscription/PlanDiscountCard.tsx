import PlanStateLayout from './PlanStateLayout';
import PlanUsage from './PlanUsage';
import type { SummaryRow } from './RetentionFlow/SummaryRows';
import { intervalOf, planHours } from './planState';
import { type ActiveSubscription, formatBillingDate, formatPriceWithInterval, planStatus } from './utils';

interface Props {
    subscription: ActiveSubscription;
}

const discountTitle = ({ percentOff, fullPriceFrom }: ActiveSubscription['discount']) => {
    const offer = percentOff === null ? 'Discounted price' : `${percentOff}% off`;
    return fullPriceFrom ? `${offer} until ${formatBillingDate(fullPriceFrom)}` : offer;
};

const discountFacts = (subscription: ActiveSubscription): SummaryRow[] => {
    const { discountedPrice, standardPrice, fullPriceFrom } = subscription.discount;
    const renewsAt = subscription.billing?.period?.end;
    const interval = intervalOf(subscription);
    return [
        ...(discountedPrice !== null
            ? [{ label: 'Discounted price', value: formatPriceWithInterval(discountedPrice, interval) }]
            : []),
        ...(renewsAt ? [{ label: 'Next renewal', value: formatBillingDate(renewsAt) }] : []),
        ...(standardPrice !== null
            ? [{
                label: fullPriceFrom ? `From ${formatBillingDate(fullPriceFrom)}` : 'Standard price',
                value: formatPriceWithInterval(standardPrice, interval),
            }]
            : []),
    ];
};

export default function PlanDiscountCard({ subscription }: Props) {
    const hours = planHours(subscription);

    return (
        <PlanStateLayout
            title={discountTitle(subscription.discount)}
            plan={hours ? `${subscription.name} · ${hours} / month` : subscription.name}
            status={planStatus(subscription)}
            facts={discountFacts(subscription)}
        >
            <PlanUsage />
        </PlanStateLayout>
    );
}
