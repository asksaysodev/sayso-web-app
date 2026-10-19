import axios from 'axios';
import getApiErrorMessage from '@/utils/getApiErrorMessage';

export interface TeamError {
    field: 'name' | 'form';
    message: string;
}

/**
 * Team writes can 409 for a taken name (shown on the name field) or for member conflicts
 * (shown on the form). Told apart by `code`, never by copy.
 */
export default function teamError(error: unknown, fallback: string): TeamError {
    const message = getApiErrorMessage(error, fallback);
    const code = axios.isAxiosError<{ code?: string }>(error) ? error.response?.data?.code : undefined;

    return { field: code === 'TEAM_NAME_TAKEN' ? 'name' : 'form', message };
}
