import axios from 'axios';
import getApiErrorMessage from '@/utils/getApiErrorMessage';

export interface CreateTeamError {
    field: 'name' | 'form';
    message: string;
}

/**
 * `POST /teams` has three 409s: a taken name (shown on the name field), members already in a
 * team, and a cap the members would exceed. Told apart by `code`, never by copy.
 */
export default function createTeamError(error: unknown): CreateTeamError {
    const message = getApiErrorMessage(error, 'Failed to create team. Please try again.');
    const code = axios.isAxiosError<{ code?: string }>(error) ? error.response?.data?.code : undefined;

    return { field: code === 'TEAM_NAME_TAKEN' ? 'name' : 'form', message };
}
