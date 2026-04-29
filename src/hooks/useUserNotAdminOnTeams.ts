import { useAuth } from "@/context/AuthContext";
import { useMemo } from "react";

/**
 * @returns {boolean} If true, means that the user's account type is `teams` and he is not an admin
 */
export default function useUserNotAdminOnTeams(): boolean {
    const { globalUser } = useAuth();
    return useMemo(() =>
        globalUser?.account_type === 'team' &&
        (globalUser?.role !== 'admin' && globalUser?.role !== 'superadmin'), 
        [globalUser]
    );
}