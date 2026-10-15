import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { LuX } from 'react-icons/lu';
import { Plus } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ConversationItem } from '@/types/coach';
import SearchBar, { SearchFilterConfig } from '@/components/ui/search-bar';
import FilterPill from '@/components/ui/filter-pill';
import TextFilterPill from '@/components/ui/text-filter-pill';
import useDebounce from '@/hooks/useDebounce';
import useScopeFilterOptions from '@/hooks/useScopeFilterOptions';
import { useAuth } from '@/context/AuthContext';
import FiltersButton from '@/components/ScopeFilters/FiltersButton';
import FiltersDrawer from '@/components/ScopeFilters/FiltersDrawer';
import findScopeSelectionLabel from '@/utils/findScopeSelectionLabel';
import shouldRetryQuery from '@/utils/shouldRetryQuery';
import displayName from '@/utils/displayName';
import getConversations from '../../services/getConversations';
import { CONVERSATIONS_QUERY_KEY } from '../../queryKeys';
import type { ConversationFilter } from '../../types';
import useConversationScope from '../../hooks/useConversationScope';
import useConversationRequestScope from '../../hooks/useConversationRequestScope';
import useResetConversationScope from '../../hooks/useResetConversationScope';
import getEmptyConversationsText from '../../utils/getEmptyConversationsText';
import getConversationAccountId from '../../utils/getConversationAccountId';
import useConversationsSocket from './hooks/useConversationsSocket';
import InsightsCalendarPopover, { INITIAL_DATE_RANGE } from '../InsightsCalendarPopover';
import ConversationCollapsibleItem from './ConversationCollapsibleItem';
import ConversationsListSkeleton from './ConversationsListSkeleton';
import ScopeFilterPill from './components/ScopeFilterPill';
import './styles/Conversations.css';

type SearchBarFilter = ConversationFilter | { key: 'scope'; value: string };

const AVAILABLE_FILTERS: SearchFilterConfig<ConversationFilter>[] = [
    {
        key: 'has_summary',
        label: 'Summary Created',
        description: 'Show only conversations with a summary',
        defaultValue: () => ({ key: 'has_summary', value: 'true' }),
    },
    {
        key: 'lead_type',
        label: 'Lead type',
        description: 'Filter by lead type',
        defaultValue: () => ({ key: 'lead_type', value: 'all' }),
    },
    {
        key: 'appointment_booked',
        label: 'Appointment',
        description: 'Filter by appointment status',
        defaultValue: () => ({ key: 'appointment_booked', value: 'all' }),
    },
    {
        key: 'lead_name',
        label: 'Lead name',
        description: 'Search by client name',
        defaultValue: () => ({ key: 'lead_name', value: '' }),
    },
];

export default function Conversations() {
    const [searchInputValue, setSearchInputValue] = useState('');
    const [dateRangeFilter, setDateRangeFilter] = useState<DateRange | undefined>(INITIAL_DATE_RANGE);
    const [openedConversations, setOpenedConversations] = useState<string[]>([]);
    const [activeFilters, setActiveFilters] = useState<ConversationFilter[]>([{ key: 'has_summary', value: 'true' }]);
    const [isScopeDrawerOpen, setIsScopeDrawerOpen] = useState(false);
    const debouncedSearch = useDebounce(searchInputValue, 500);
    const { globalUser } = useAuth();
    const { isAdmin, selection, isOwnSelection, setSelection, resetToOwn } = useConversationScope();
    const requestScope = useConversationRequestScope(isAdmin, selection);
    const { teams, members } = useScopeFilterOptions(isAdmin);

    useConversationsSocket();

    const {
        data: conversationsData,
        isLoading,
        error,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
    } = useInfiniteQuery({
        queryKey: [...CONVERSATIONS_QUERY_KEY, requestScope.key, activeFilters, dateRangeFilter, debouncedSearch],
        queryFn: ({ pageParam }) => getConversations(pageParam, activeFilters, dateRangeFilter, debouncedSearch, requestScope.params),
        getNextPageParam: (lastPage, allPages) => lastPage.hasNextPage ? allPages.length : undefined,
        initialPageParam: 0,
        retry: shouldRetryQuery,
    });

    const scopeName = findScopeSelectionLabel(selection, teams.options, members.options)
        ?? (isOwnSelection && globalUser ? displayName(globalUser) : null);
    const scopeList = selection?.scope === 'team' ? teams : members;
    const isScopeStale = !!selection && !scopeList.isLoading && !scopeList.isError && scopeName === null;

    const isResettingScope = useResetConversationScope(error, isScopeStale, isOwnSelection, resetToOwn);

    const scopePill: SearchBarFilter[] = isAdmin && selection && scopeName ? [{ key: 'scope', value: scopeName }] : [];
    const searchBarFilters: SearchBarFilter[] = [...scopePill, ...activeFilters];

    const setSearchBarFilters: Dispatch<SetStateAction<SearchBarFilter[]>> = (update) => {
        setActiveFilters((prev) => {
            const next = typeof update === 'function' ? update([...scopePill, ...prev]) : update;
            return next.filter((filter): filter is ConversationFilter => filter.key !== 'scope');
        });
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
                            <SearchBar
                                searchText={searchInputValue}
                                onSearchTextChange={setSearchInputValue}
                                activeFilters={searchBarFilters}
                                setActiveFilters={setSearchBarFilters}
                                availableFilters={AVAILABLE_FILTERS}
                                placeholder="Search conversations..."
                                filterPillRenderers={{
                                    scope: (filter) => (
                                        <ScopeFilterPill
                                            label={selection?.scope === 'team' ? 'team' : 'user'}
                                            value={filter.value}
                                            onOpen={() => setIsScopeDrawerOpen(true)}
                                            onRemove={() => setSelection(null)}
                                        />
                                    ),
                                    has_summary: (_filter, _onUpdate, onRemove) => (
                                        <div className="search-filter-pill">
                                            <span className="filter-pill-label">Summary Created</span>
                                            <button className="filter-pill-remove" onClick={onRemove}>
                                                <LuX size={12} />
                                            </button>
                                        </div>
                                    ),
                                    lead_type: (filter, onUpdate, onRemove) => (
                                        <FilterPill
                                            label="lead type"
                                            options={['all', 'buyer', 'seller']}
                                            filter={filter}
                                            onUpdate={onUpdate}
                                            onRemove={onRemove}
                                        />
                                    ),
                                    appointment_booked: (filter, onUpdate, onRemove) => (
                                        <FilterPill
                                            label="appointment"
                                            options={['all', 'booked', 'not booked']}
                                            filter={filter}
                                            onUpdate={onUpdate}
                                            onRemove={onRemove}
                                        />
                                    ),
                                    lead_name: (filter, onUpdate, onRemove) => (
                                        <TextFilterPill
                                            label="lead name"
                                            filter={filter}
                                            onUpdate={onUpdate}
                                            onRemove={onRemove}
                                            placeholder="search by name…"
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
                            {isAdmin && <FiltersButton onClick={() => setIsScopeDrawerOpen(true)} />}
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
                                {getEmptyConversationsText(selection, isOwnSelection, !!debouncedSearch || activeFilters.length > 0)}
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
            {isAdmin && (
                <FiltersDrawer
                    open={isScopeDrawerOpen}
                    onOpenChange={setIsScopeDrawerOpen}
                    selection={selection}
                    onApply={setSelection}
                    teams={teams}
                    members={members}
                />
            )}
        </div>
    );
}
