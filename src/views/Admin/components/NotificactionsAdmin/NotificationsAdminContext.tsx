import { createContext, useContext, useState, useMemo, Dispatch, SetStateAction, ReactNode } from 'react';
import { CreatedNotification, NotificationActiveFilter, NotificationStatus } from '../../types';
import useAdminNotifications from '../../hooks/useAdminNotifications';

function getStatus(n: CreatedNotification): NotificationStatus {
    if (n.expires_at && new Date(n.expires_at) < new Date()) return 'expired';
    if (!n.active) return 'paused';
    return 'active';
}

interface NotificationsAdminContextValue {
    searchText: string;
    setSearchText: (text: string) => void;
    activeFilters: NotificationActiveFilter[];
    setActiveFilters: Dispatch<SetStateAction<NotificationActiveFilter[]>>;
    filteredNotifications: CreatedNotification[];
    isLoading: boolean;
    isRefetching: boolean;
}

const NotificationsAdminContext = createContext<NotificationsAdminContextValue | null>(null);

export function NotificationsAdminProvider({ children }: { children: ReactNode }) {
    const { notificationsbulk, isLoading, isRefetching } = useAdminNotifications();
    const [searchText, setSearchText] = useState('');
    const [activeFilters, setActiveFilters] = useState<NotificationActiveFilter[]>([]);

    const filteredNotifications = useMemo(() => {
        let result = notificationsbulk ?? [];

        if (searchText.trim()) {
            const q = searchText.toLowerCase();
            result = result.filter(n =>
                n.title.toLowerCase().includes(q) ||
                (n.description ?? '').toLowerCase().includes(q)
            );
        }

        for (const filter of activeFilters) {
            if (filter.key === 'status' && filter.value !== 'all') {
                result = result.filter(n => getStatus(n) === filter.value);
            }
            if (filter.key === 'type') {
                result = result.filter(n => n.type === filter.value);
            }
        }

        return result;
    }, [notificationsbulk, searchText, activeFilters]);

    return (
        <NotificationsAdminContext.Provider value={{
            searchText,
            setSearchText,
            activeFilters,
            setActiveFilters,
            filteredNotifications,
            isLoading,
            isRefetching,
        }}>
            {children}
        </NotificationsAdminContext.Provider>
    );
}

export function useNotificationsAdmin() {
    const ctx = useContext(NotificationsAdminContext);
    if (!ctx) throw new Error('useNotificationsAdmin must be used inside NotificationsAdminProvider');
    return ctx;
}
