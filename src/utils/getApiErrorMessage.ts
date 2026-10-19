import axios from "axios";

/**
 * The server's `{ error }` message from an axios failure, or `fallback` for anything else.
 */
export default function getApiErrorMessage(error: unknown, fallback: string): string {
    if (axios.isAxiosError<{ error?: string }>(error)) {
        return error.response?.data?.error ?? fallback;
    }
    return fallback;
}
