import apiClient from "@/config/axios";
import { supabase } from "@/config/supabase";

interface AcceptInvitePayload {
    // token: string;
    email: string;
    name?: string;
    lastname?: string;
    company?: string;
}

export default async function acceptInvite(payload: AcceptInvitePayload, token: string): Promise<unknown> {
    const response = await apiClient.post(`accounts/company/invite/accept?token=${token}`, payload);

    if (!response?.data) {
        throw new Error("Failed to accept invite");
    }

    // The access token was minted at sign-up, before the accounts row existed and before
    // the server wrote the company_id claim into app_metadata. Refresh so the session that
    // continues into the dashboard actually carries it — otherwise the invitee holds a
    // claimless token until it happens to expire, and looks correctly signed in while
    // being invisible to any policy scoped on that claim.
    //
    // Non-fatal: the invite is already accepted, and the next natural refresh picks the
    // claim up. Failing here would strand a user whose account was created successfully.
    const { error: refreshError } = await supabase.auth.refreshSession();
    if (refreshError) {
        console.error("Error refreshing session after accepting invite:", refreshError);
    }

    return response.data;
}
