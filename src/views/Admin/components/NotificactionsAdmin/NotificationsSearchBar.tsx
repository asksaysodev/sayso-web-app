import SearchBar, { SearchFilterConfig } from '@/components/ui/search-bar';
import { NotificationActiveFilter } from '../../types';
import { useNotificationsAdmin } from './NotificationsAdminContext';
import NotificationFilterPill from './NotificationFilterPill';

const AVAILABLE_FILTERS: SearchFilterConfig<NotificationActiveFilter>[] = [
    {
        key: 'status',
        label: 'Status',
        description: 'Filter by active, paused, or expired',
        defaultValue: () => ({ key: 'status', value: 'all' }),
    },
    {
        key: 'type',
        label: 'Type',
        description: 'Filter by media or article',
        defaultValue: () => ({ key: 'type', value: 'media' }),
    },
];

export default function NotificationsSearchBar() {
    const { searchText, setSearchText, activeFilters, setActiveFilters } = useNotificationsAdmin();

    return (
        <SearchBar
            searchText={searchText}
            onSearchTextChange={setSearchText}
            activeFilters={activeFilters}
            setActiveFilters={setActiveFilters}
            availableFilters={AVAILABLE_FILTERS}
            placeholder="Search notifications..."
            filterPillRenderers={{
                status: (filter, onUpdate, onRemove) => (
                    <NotificationFilterPill filter={filter as NotificationActiveFilter} onUpdate={onUpdate} onRemove={onRemove} />
                ),
                type: (filter, onUpdate, onRemove) => (
                    <NotificationFilterPill filter={filter as NotificationActiveFilter} onUpdate={onUpdate} onRemove={onRemove} />
                ),
            }}
        />
    );
}
