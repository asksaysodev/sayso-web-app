import { useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function useHasSubscription() {
    const { globalUser } = useAuth();
    return useMemo(() => !!globalUser?.subscription_plan_id, [globalUser]);
}
