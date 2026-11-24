import axios from 'axios';
import getApiErrorMessage from '@/utils/getApiErrorMessage';

const UNCONFIRMED_MESSAGE = "We couldn't confirm whether this went through. Try again to check.";
const GENERIC_MESSAGE = 'We could not update your subscription. Please try again.';

export const getRetentionErrorCode = (error: unknown) =>
    axios.isAxiosError<{ code?: string }>(error) ? error.response?.data?.code : undefined;

/** 5xx refusals the server sends before it touches Stripe: nothing was applied. */
const REFUSED_BEFORE_CHANGE = ['stripe_unavailable', 'events_unavailable'];

/** No answer, or a server/Stripe failure: the change may still have been applied. */
export const isUnconfirmed = (error: unknown) => {
    if (!axios.isAxiosError(error)) return false;
    if (!error.response) return true;
    return error.response.status >= 500 && !REFUSED_BEFORE_CHANGE.includes(getRetentionErrorCode(error) ?? '');
};

export const getRetentionErrorMessage = (error: unknown) =>
    isUnconfirmed(error) ? UNCONFIRMED_MESSAGE : getApiErrorMessage(error, GENERIC_MESSAGE);
