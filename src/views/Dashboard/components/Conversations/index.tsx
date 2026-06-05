import { useMemo, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ConversationItem, LeadTypeFilter } from '@/types/coach';
import SearchBar, { SearchFilterConfig } from '@/components/ui/search-bar';
import FilterPill from '@/components/ui/filter-pill';
import useDebounce from '@/hooks/useDebounce';
import getConversations from '../../services/getConversations';
import InsightsCalendarPopover, { INITIAL_DATE_RANGE } from '../InsightsCalendarPopover';
import ConversationCollapsibleItem from './ConversationCollapsibleItem';
import ConversationsListSkeleton from './ConversationsListSkeleton';
import './styles/Conversations.css';

type LeadTypeFilterConfig = {
    key: 'lead_type';
    value: LeadTypeFilter;
}

const AVAILABLE_FILTERS: SearchFilterConfig<LeadTypeFilterConfig>[] = [
    {
        key: 'lead_type',
        label: 'Lead type',
        description: 'Filter by Lead type',
        defaultValue: () => ({ key: 'lead_type', value: 'all' }),
    },
];

export default function Conversations() {
    const [searchInputValue, setSearchInputValue] = useState('');
    const [dateRangeFilter, setDateRangeFilter] = useState<DateRange | undefined>(INITIAL_DATE_RANGE);
    const [openedConversations, setOpenedConversations] = useState<string[]>([]);
    const [activeFilters, setActiveFilters] = useState<LeadTypeFilterConfig[]>([]);
    const debouncedSearch = useDebounce(searchInputValue, 500);

    const {
        data: conversationsData,
        isLoading,
        error,
        isFetchingNextPage,
        isRefetching,
        fetchNextPage,
        hasNextPage,
    } = useInfiniteQuery({
        queryKey: ['dashboard-conversations', activeFilters, dateRangeFilter, debouncedSearch],
        queryFn: ({ pageParam }) => getConversations(pageParam, activeFilters, dateRangeFilter, debouncedSearch),
        getNextPageParam: (lastPage, allPages) => lastPage.hasNextPage ? allPages.length : undefined,
        initialPageParam: 0,
    });

    const conversations = useMemo(() => {
        if (!conversationsData?.pages) return [];

        const seen = new Set<string>();
        const flat: ConversationItem[] = [];

        conversationsData.pages.forEach(page => {
            page.conversations.forEach(conversation => {
                if (!seen.has(conversation.id)) {
                    seen.add(conversation.id);
                    flat.push(conversation);
                }
            });
        });

        return flat;
    }, [conversationsData]);

    const handleToggle = (id: string) => {
        setOpenedConversations(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    return (
        <div className="conversations-container">
            <div className="conversations-header">
                <p>Conversations</p>

                <div className="conversations-header-right-content">
                    <div className="conversations-search-row">
                        <SearchBar
                            searchText={searchInputValue}
                            onSearchTextChange={setSearchInputValue}
                            activeFilters={activeFilters}
                            setActiveFilters={setActiveFilters}
                            availableFilters={AVAILABLE_FILTERS}
                            placeholder="Search conversations..."
                            filterPillRenderers={{
                                lead_type: (filter, onUpdate, onRemove) => (
                                    <FilterPill
                                        label="lead type"
                                        options={['all', 'buyer', 'seller']}
                                        filter={filter}
                                        onUpdate={onUpdate}
                                        onRemove={onRemove}
                                    />
                                ),
                            }}
                        />
                    </div>

                    <div className="conversations-filters-row">
                        <InsightsCalendarPopover
                            applyDateRangeFilter={setDateRangeFilter}
                            currentDateRange={dateRangeFilter}
                            onResetDateRange={() => setDateRangeFilter(INITIAL_DATE_RANGE)}
                        />
                    </div>
                </div>
            </div>

            <div className="conversations-list-container">
                {error ? (
                    <div className="empty-conversations-container">
                        <p className="empty-conversations-text">
                            Unable to load conversations. Please try again later.
                        </p>
                    </div>
                ) : (isLoading && conversations.length === 0) || isRefetching ? (
                    <ConversationsListSkeleton />
                ) : conversations.length > 0 ? (
                    <>
                        {conversations.map(conv => (
                            <ConversationCollapsibleItem
                                key={conv.id}
                                conversation={conv}
                                isOpen={openedConversations.includes(conv.id)}
                                onToggle={() => handleToggle(conv.id)}
                            />
                        ))}
                        {hasNextPage && (
                            <button
                                className="load-more-conversations-button"
                                onClick={() => fetchNextPage()}
                                disabled={isFetchingNextPage}
                            >
                                {isFetchingNextPage ? 'Loading...' : 'Load more'}
                            </button>
                        )}
                    </>
                ) : (
                    <div className="empty-conversations-container">
                        <p className="empty-conversations-text">
                            {debouncedSearch || activeFilters.length > 0
                                ? 'No conversations match your filters.'
                                : 'No conversations yet.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
