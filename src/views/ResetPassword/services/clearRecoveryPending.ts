import apiClient from "@/config/axios";

/**
 * Tells the backend this recovery link has been verified, releasing the flag that blocks
 * desktop session handoffs while a reset link is live (SAYSO-433).
 *
 * Supabase consumes the one-time token at verification, so from here the flag guards
 * nothing — leaving it set would cost the user a manual login on the desktop app's
 * "My Account" for the rest of its lifetime.
 *
 * Authenticated by the session `setSession` has just established; the request
 * interceptor in config/axios.ts attaches it.
 */
export default async function clearRecoveryPending(): Promise<void> {
    await apiClient.post(`auth/recovery-complete`);
}
