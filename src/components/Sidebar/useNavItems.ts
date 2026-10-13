import { useMemo } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Building2, CreditCard, MessagesSquare, Settings, Shield, Store, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import useHasSubscription from '@/hooks/useHasSubscription';
import useIsTeamAdmin from '@/hooks/useIsTeamAdmin';
import useUserNotAdminOnTeams from '@/hooks/useUserNotAdminOnTeams';

export interface NavItem {
    to: string;
    label: string;
    icon: LucideIcon;
}

export default function useNavItems(): NavItem[] {
    const { isSuperAdmin } = useAuth();
    const hasSubscription = useHasSubscription();
    const isTeamAdmin = useIsTeamAdmin();
    const userNotAdminOnTeams = useUserNotAdminOnTeams();

    return useMemo(() => {
        const items: (NavItem | false)[] = [
            hasSubscription && { to: '/', label: 'Dashboard', icon: Users },
            { to: '/marketplace', label: 'Marketplace', icon: Store },
            isTeamAdmin && { to: '/organization', label: 'Organization', icon: Building2 },
            { to: '/settings', label: 'Settings', icon: Settings },
            !userNotAdminOnTeams && { to: '/subscription', label: 'Subscription', icon: CreditCard },
            hasSubscription && { to: '/conversations', label: 'Conversations', icon: MessagesSquare },
            isSuperAdmin && { to: '/admin', label: 'Admin', icon: Shield },
        ];
        return items.filter((item): item is NavItem => Boolean(item));
    }, [hasSubscription, isTeamAdmin, userNotAdminOnTeams, isSuperAdmin]);
}
