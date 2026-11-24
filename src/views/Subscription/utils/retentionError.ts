import axios from 'axios';
import getApiErrorMessage from '@/utils/getApiErrorMessage';

const UNCONFIRMED_MESSAGE = "We couldn't confirm whether this went through. Try again to check.";
const GENERIC_MESSAGE = 'We could not update your subscription. Please try again.';

export const getRetentionErrorCode = (error: unknown) =>
    axios.isAxiosError<{ code?: string }>(error) ? error.response?.data?.code : undefined;

/** No answer, or a server/Stripe failure: the change may still have been applied. */
export const isUnconfirmed = (error: unknown) =>
    axios.isAxiosError(error) && (!error.response || error.response.status >= 500);

export const getRetentionErrorMessage = (error: unknown) =>
    getApiErrorMessage(error, isUnconfirmed(error) ? UNCONFIRMED_MESSAGE : GENERIC_MESSAGE);
