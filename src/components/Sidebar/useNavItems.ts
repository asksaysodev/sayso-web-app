import { useMemo } from 'react';
import type { IconType } from 'react-icons';
import { PiChats, PiShield, PiSquaresFour, PiUsersFour } from 'react-icons/pi';
import { useAuth } from '@/context/AuthContext';
import useHasSubscription from '@/hooks/useHasSubscription';
import useIsTeamAdmin from '@/hooks/useIsTeamAdmin';

export interface NavItem {
    to: string;
    label: string;
    icon: IconType;
}

export default function useNavItems(): NavItem[] {
    const { isSuperAdmin } = useAuth();
    const hasSubscription = useHasSubscription();
    const isTeamAdmin = useIsTeamAdmin();

    return useMemo(() => {
        const items: (NavItem | false)[] = [
            hasSubscription && { to: '/', label: 'Dashboard', icon: PiSquaresFour },
            hasSubscription && { to: '/conversations', label: 'Conversations', icon: PiChats },
            isTeamAdmin && { to: '/organization', label: 'Organization', icon: PiUsersFour },
            isSuperAdmin && { to: '/admin', label: 'Admin', icon: PiShield },
        ];
        return items.filter((item): item is NavItem => Boolean(item));
    }, [hasSubscription, isTeamAdmin, isSuperAdmin]);
}
