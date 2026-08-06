import { useAuth } from "@/context/AuthContext";
import { TEAM_ADMIN_ROLES } from "@/types/user";
import { useMemo } from "react";

/**
 * @returns {boolean} If true, means that the user's account type is `teams` and he is an admin
 */

export default function useIsTeamAdmin(): boolean {
    const { globalUser } = useAuth();
    return useMemo(() =>
        globalUser?.account_type === 'team' &&
        !!globalUser?.role && TEAM_ADMIN_ROLES.includes(globalUser.role),
        [globalUser]
    );
}
