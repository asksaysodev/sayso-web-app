import { createContext, useContext, useState, useMemo, Dispatch, SetStateAction, ReactNode } from 'react';
import { CreatedNotification, NotificationActiveFilter } from '@/types/notifications';
import { getStatus } from './helpers/getStatus';
import useAdminNotifications from '../../hooks/useAdminNotifications';

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
    const { notifications, isLoading, isRefetching } = useAdminNotifications();
    const [searchText, setSearchText] = useState('');
    const [activeFilters, setActiveFilters] = useState<NotificationActiveFilter[]>([]);

    const filteredNotifications = useMemo(() => {
        let result = notifications ?? [];

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
    }, [notifications, searchText, activeFilters]);

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
