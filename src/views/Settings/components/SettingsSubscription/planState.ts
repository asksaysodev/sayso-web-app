import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { type ActiveSubscription, formatBillingDate, formatDollars, formatPriceWithInterval, isCancelling } from './utils';

dayjs.extend(utc);

export type PlanState = 'cancelling' | 'pause-scheduled' | 'paused' | 'normal';

/** A scheduled pause whose start has passed is already paused, even before the webhook says so. */
export const isPauseStarted = ({ pause }: ActiveSubscription) =>
    pause.state === 'paused' || (pause.state === 'scheduled' && !!pause.startsAt && dayjs.utc(pause.startsAt) <= dayjs.utc());

export const planStateOf = (subscription: ActiveSubscription): PlanState => {
    if (subscription.isPartnerFunded || subscription.status === 'canceled') return 'normal';
    if (isCancelling(subscription)) return 'cancelling';
    if (subscription.pause.state === 'none') return 'normal';
    return isPauseStarted(subscription) ? 'paused' : 'pause-scheduled';
};

/** Discounted plans that renew; partner-funded and canceled ones keep the plain plan card. */
export const hasDiscountCard = ({ discount, isPartnerFunded, status }: ActiveSubscription) =>
    discount.active && discount.discountedPrice !== null && discount.standardPrice !== null && !isPartnerFunded && status !== 'canceled';

/** A pause without a resume date was not set by our flow; only support can change it. */
export const canResume = (subscription: ActiveSubscription) => !!subscription.pause.resumesAt;

export const intervalOf = (subscription: ActiveSubscription) => subscription.interval ?? subscription.billing?.cycle ?? null;

const standardPrice = ({ discount, price }: ActiveSubscription) =>
    discount.standardPrice ?? (price.priceInCents ? price.priceInCents / 100 : null);

/** Price of a bill dated `date`: discounted while the discount lasts, full from the bill on its end date. */
export const priceOn = (subscription: ActiveSubscription, date: string) => {
    const { active, discountedPrice, endsAt } = subscription.discount;
    const isDiscounted = active && discountedPrice !== null && (!endsAt || dayjs.utc(date) < dayjs.utc(endsAt));
    return isDiscounted ? discountedPrice : standardPrice(subscription);
};

export interface Bill {
    date: string;
    price: number | null;
}

const billOn = (subscription: ActiveSubscription, date: string): Bill => ({ date, price: priceOn(subscription, date) });

/** First bill if the cancellation is undone: the renewal date, or the resume date when a pause remains. */
export const billAfterReactivation = (subscription: ActiveSubscription): Bill | null => {
    const { cancellation, pause } = subscription;
    const date = pause.state === 'none' ? cancellation.accessEndsAt : pause.resumesAt;
    return date ? billOn(subscription, date) : null;
};

/** The renewal a scheduled pause would have skipped. */
export const billAfterRemovingPause = (subscription: ActiveSubscription): Bill | null => {
    const date = subscription.pause.startsAt ?? subscription.billing.period.end;
    return date ? billOn(subscription, date) : null;
};

export const todayBill = (subscription: ActiveSubscription) => billOn(subscription, dayjs.utc().toISOString());

/** Renewal of a cycle starting at `start`; the server's own date replaces it once resumed. */
export const renewalAfter = (subscription: ActiveSubscription, start: string) =>
    billOn(subscription, dayjs.utc(start).add(1, intervalOf(subscription) === 'year' ? 'year' : 'month').toISOString());

export const planLabel = (subscription: ActiveSubscription) => {
    const price = standardPrice(subscription);
    return price === null ? subscription.name : `${subscription.name} · ${formatPriceWithInterval(price, intervalOf(subscription))}`;
};

export const formatBill = ({ date, price }: Bill) =>
    price === null ? formatBillingDate(date) : `${formatDollars(price)} · ${formatBillingDate(date)}`;

/** "$369 on Nov 9, 2026", or "on Nov 9, 2026" when the price is unknown. */
export const formatBillSentence = ({ date, price }: Bill) =>
    `${price === null ? '' : `${formatDollars(price)} `}on ${formatBillingDate(date)}`;

export const planHours = (subscription: ActiveSubscription) => {
    const minutes = subscription.includedMinutes?.plan;
    return minutes ? `${Math.floor(minutes / 60)} hours` : null;
};
