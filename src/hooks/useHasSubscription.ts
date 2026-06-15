import { useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function useHasSubscription() {
    const { globalUser } = useAuth();
    return useMemo(() => {
        if (!globalUser?.subscription_plan_id) return false;
        if (globalUser.subscription_status === 'canceled') {
            const periodEnd = globalUser.subscription_current_period_end;
            return !!periodEnd && new Date(periodEnd) > new Date();
        }
        return true;
    }, [globalUser]);
}

