import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ConversationItem } from '@/types/coach';
import useDebounce from '@/hooks/useDebounce';
import useScopeFilterOptions from '@/hooks/useScopeFilterOptions';
import { useAuth } from '@/context/AuthContext';
import FiltersButton from '@/components/ScopeFilters/FiltersButton';
import findScopeSelectionLabel from '@/utils/findScopeSelectionLabel';
import shouldRetryQuery from '@/utils/shouldRetryQuery';
import displayName from '@/utils/displayName';
import getConversations from '../../services/getConversations';
import { CONVERSATIONS_QUERY_KEY } from '../../queryKeys';
import useConversationScope from '../../hooks/useConversationScope';
import useConversationRequestScope from '../../hooks/useConversationRequestScope';
import useResetConversationScope from '../../hooks/useResetConversationScope';
import getEmptyConversationsText from '../../utils/getEmptyConversationsText';
import getConversationAccountId from '../../utils/getConversationAccountId';
import {
    DEFAULT_CONVERSATION_FILTERS,
    getConversationFilterChips,
    toRequestFilters,
    type ConversationFilterState,
} from '../../utils/conversationFilters';
import useConversationsSocket from './hooks/useConversationsSocket';
import InsightsCalendarPopover, { INITIAL_DATE_RANGE } from '../InsightsCalendarPopover';
import ConversationCollapsibleItem from './ConversationCollapsibleItem';
import ConversationsListSkeleton from './ConversationsListSkeleton';
import ConversationsSearchBar, { type SearchChip } from './components/ConversationsSearchBar';
import ConversationsFiltersDrawer, { type ConversationsFiltersApply } from './components/ConversationsFiltersDrawer';
import './styles/Conversations.css';

export default function Conversations() {
    const [searchInputValue, setSearchInputValue] = useState('');
    const [dateRangeFilter, setDateRangeFilter] = useState<DateRange | undefined>(INITIAL_DATE_RANGE);
    const [openedConversations, setOpenedConversations] = useState<string[]>([]);
    const [filters, setFilters] = useState<ConversationFilterState>(DEFAULT_CONVERSATION_FILTERS);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const debouncedSearch = useDebounce(searchInputValue, 500);
    const { globalUser } = useAuth();
    const { isAdmin, selection, isOwnSelection, setSelection, resetToCompany } = useConversationScope();
    const requestScope = useConversationRequestScope(isAdmin, selection);
    const { teams, members } = useScopeFilterOptions(isAdmin);

    useConversationsSocket();

    const requestFilters = useMemo(() => toRequestFilters(filters), [filters]);

    const {
        data: conversationsData,
        isLoading,
        error,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
    } = useInfiniteQuery({
        queryKey: [...CONVERSATIONS_QUERY_KEY, requestScope.key, requestFilters, dateRangeFilter, debouncedSearch],
        queryFn: ({ pageParam }) => getConversations(pageParam, requestFilters, dateRangeFilter, debouncedSearch, requestScope.params),
        getNextPageParam: (lastPage, allPages) => lastPage.hasNextPage ? allPages.length : undefined,
        initialPageParam: 0,
        retry: shouldRetryQuery,
    });

    const scopeName = findScopeSelectionLabel(selection, teams.options, members.options)
        ?? (isOwnSelection && globalUser ? displayName(globalUser) : null);
    const scopeList = selection?.scope === 'team' ? teams : members;
    const isScopeStale = !!selection && !scopeList.isLoading && !scopeList.isError && scopeName === null;

    const isResettingScope = useResetConversationScope(error, isScopeStale, selection, isAdmin, resetToCompany);

    const searchChips: SearchChip[] = [
        ...(isAdmin && selection && scopeName
            ? [{ key: 'scope', label: scopeName, onRemove: () => setSelection(null) }]
            : []),
        ...getConversationFilterChips(filters).map((chip) => ({
            key: chip.key,
            label: chip.label,
            onRemove: () => setFilters(chip.clear),
        })),
    ];

    const applyFilters = ({ filters: nextFilters, selection: nextSelection }: ConversationsFiltersApply) => {
        setFilters(nextFilters);
        if (isAdmin) setSelection(nextSelection);
    };

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
        <div className="conversations-section">
            <div className="conversations-container">
                <div className="conversations-header">
                    <div className="conversations-header-right-content">
                        <div className="conversations-search-row">
                            <ConversationsSearchBar
                                searchText={searchInputValue}
                                onSearchTextChange={setSearchInputValue}
                                chips={searchChips}
                                placeholder="Search conversations..."
                            />
                        </div>

                        <div className="conversations-filters-row">
                            <InsightsCalendarPopover
                                applyDateRangeFilter={setDateRangeFilter}
                                currentDateRange={dateRangeFilter}
                                onResetDateRange={() => setDateRangeFilter(INITIAL_DATE_RANGE)}
                            />
                            <FiltersButton onClick={() => setIsFiltersOpen(true)} />
                        </div>
                    </div>
                </div>

                <div className="conversations-list-container">
                    {isResettingScope || (isLoading && conversations.length === 0) ? (
                        <ConversationsListSkeleton />
                    ) : error ? (
                        <div className="empty-conversations-container">
                            <p className="empty-conversations-text">
                                Unable to load conversations. Please try again later.
                            </p>
                        </div>
                    ) : conversations.length > 0 ? (
                        <>
                            {conversations.map(conv => (
                                <ConversationCollapsibleItem
                                    key={conv.id}
                                    conversation={conv}
                                    isOpen={openedConversations.includes(conv.id)}
                                    isOwn={!!globalUser && getConversationAccountId(conv, selection) === globalUser.id}
                                    onToggle={() => handleToggle(conv.id)}
                                />
                            ))}
                        </>
                    ) : (
                        <div className="empty-conversations-container">
                            <p className="empty-conversations-text">
                                {getEmptyConversationsText(selection, isOwnSelection, !!debouncedSearch || requestFilters.length > 0)}
                            </p>
                        </div>
                    )}
                </div>
            </div>
            {hasNextPage && !error && !isResettingScope && conversations.length > 0 && (
                <button
                    className="load-more-conversations-button"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                >
                    {isFetchingNextPage ? 'Loading...' : 'Load more'}
                    {!isFetchingNextPage && <Plus size={20} />}
                </button>
            )}
            <ConversationsFiltersDrawer
                open={isFiltersOpen}
                onOpenChange={setIsFiltersOpen}
                filters={filters}
                onApply={applyFilters}
                scope={isAdmin ? { selection, teams, members } : undefined}
            />
        </div>
    );
}
