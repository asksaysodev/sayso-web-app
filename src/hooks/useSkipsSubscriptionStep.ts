import { useAuth } from "@/context/AuthContext";
import { useMemo } from "react";

/**
 * @returns {boolean} True when the user joined a team through an invite (team account with role `user` or `admin`).
 * Self-serve team purchasers are `owner`, and individual sign-ups have `account_type: 'individual'`, so both return false.
 */
export default function useIsInvitedTeamMember(): boolean {
    const { globalUser } = useAuth();
    return useMemo(() =>
        globalUser?.account_type === 'team' &&
        (globalUser.role === 'user' || globalUser.role === 'admin'),
        [globalUser]
    );
}
