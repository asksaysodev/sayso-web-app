import axios from "axios";

/**
 * The server's `{ error }` (or `{ message }`, used by its generic 500 handler) from an
 * axios failure, or `fallback` for anything else.
 */
export default function getApiErrorMessage(error: unknown, fallback: string): string {
    if (axios.isAxiosError<{ error?: string; message?: string }>(error)) {
        return error.response?.data?.error ?? error.response?.data?.message ?? fallback;
    }
    return fallback;
}
