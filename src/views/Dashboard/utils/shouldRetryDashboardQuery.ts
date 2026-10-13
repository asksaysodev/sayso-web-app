import axios from 'axios';

const MAX_RETRIES = 3;

export default function shouldRetryDashboardQuery(failureCount: number, error: unknown): boolean {
    const status = axios.isAxiosError(error) ? error.response?.status : undefined;
    if (status !== undefined && status >= 400 && status < 500) return false;
    return failureCount < MAX_RETRIES;
}
