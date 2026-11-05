import { useAuth } from "@/context/AuthContext";
import { useMemo } from "react";
import useHasSubscription from "./useHasSubscription";

/**
 * @returns {boolean} True when sign-up has no Subscription step: the user joined a team through an invite
 * (team account with role `user` or `admin`), or a partner funds the account and its plan is still active.
 * `is_partner_funded` stays true after the plan lapses, so it needs the subscription check.
 * Self-serve team purchasers are `owner` without a partner, and individual sign-ups have
 * `account_type: 'individual'`, so both return false.
 */
export default function useSkipsSubscriptionStep(): boolean {
    const { globalUser } = useAuth();
    const hasSubscription = useHasSubscription();
    return useMemo(() =>
        (!!globalUser?.is_partner_funded && hasSubscription) ||
        (globalUser?.account_type === 'team' &&
        (globalUser.role === 'user' || globalUser.role === 'admin')),
        [globalUser, hasSubscription]
    );
}
