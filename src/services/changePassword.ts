import axios from 'axios';
import apiClient from '../config/axios';

export type ChangePasswordErrorCode =
    | 'invalid_request'
    | 'same_password'
    | 'invalid_current_password'
    | 'weak_password'
    | 'mfa_required'
    | 'rate_limited'
    | 'internal_error'
    | 'unknown';

export type ChangePasswordResult =
    | { success: true }
    | { success: false; code: ChangePasswordErrorCode; message?: string; status?: number };

const KNOWN_CODES: ChangePasswordErrorCode[] = [
    'invalid_request',
    'same_password',
    'invalid_current_password',
    'weak_password',
    'mfa_required',
    'rate_limited',
    'internal_error',
];

/**
 * Changes the signed-in user's password through the server (never via the browser's Supabase client).
 *
 * skipRetry: axios would otherwise retry network/timeout errors, and a retry after a change that
 * already succeeded would send the now-old password and fail with invalid_current_password.
 */
export async function changePassword(currentPassword: string, newPassword: string): Promise<ChangePasswordResult> {
    try {
        await apiClient.post('/accounts/change-password', { currentPassword, newPassword }, { skipRetry: true });
        return { success: true };
    } catch (error) {
        if (axios.isAxiosError<{ code?: string; error?: string }>(error) && error.response) {
            const { code, error: message } = error.response.data ?? {};
            const known = KNOWN_CODES.find((c) => c === code);
            return {
                success: false,
                code: known ?? (error.response.status === 429 ? 'rate_limited' : 'unknown'),
                message,
                status: error.response.status,
            };
        }
        return { success: false, code: 'unknown' };
    }
}
