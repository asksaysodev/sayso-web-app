import { useMemo, useState } from 'react';
import InsightsCalendarPopover, { INITIAL_DATE_RANGE } from './InsightsCalendarPopover';

import dayjs from "dayjs";
import InsightCollapsibleTable from './InsightCollapsibleTable';
import InsightsListSkeleton from './InsightsListSkeleton';
import { DateRange } from 'react-day-picker';

import isBetween from 'dayjs/plugin/isBetween';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import getInsights from '../services/getInsights';
import { useInfiniteQuery } from '@tanstack/react-query';
import type { LeadTypeFilter, InsightGroup } from '@/types/coach';
import SearchBar, { SearchFilterConfig } from '@/components/ui/search-bar';
import FilterPill from '@/components/ui/filter-pill';

dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);

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

export default function InsightsContainer() {
    const [searchInsightInputValue, setSearchInsightInputValue] = useState('');
    const [dateRangeFilter, setDateRangeFilter] = useState<DateRange | undefined>(INITIAL_DATE_RANGE);
    const [openedInsights, setOpenedInsights] = useState<string[]>([]);
    const [activeFilters, setActiveFilters] = useState<LeadTypeFilterConfig[]>([]); 
    
    const {
        data: insightsData,
        isLoading: isLoadingInsights,
        error: errorInsights,
        isFetchingNextPage,
        isRefetching: isRefetchingInsights,
        fetchNextPage,
        hasNextPage
    } = useInfiniteQuery({
        queryKey: ['dashboard-insights', activeFilters, dateRangeFilter],
        queryFn: ({ pageParam }) => getInsights(pageParam, activeFilters, dateRangeFilter),
        getNextPageParam: (lastPage, allPages) => lastPage.hasNextPage ? allPages.length : undefined,
        initialPageParam: 0,
    });

    const insights = useMemo(() => {
        if (!insightsData?.pages) return [];

        const dateMap = new Map<string, InsightGroup>();

        insightsData.pages.forEach(page => {
            page.insights.forEach(group => {
                const existing = dateMap.get(group.date);
                if (existing) {
                    const existingIds = new Set(existing.insights.map(i => i.id));
                    const newInsights = group.insights.filter(i => !existingIds.has(i.id));
                    existing.insights.push(...newInsights);
                } else {
                    dateMap.set(group.date, { ...group, insights: [...group.insights] });
                }
            });
        });

        return Array.from(dateMap.values()).sort((a, b) => b.date.localeCompare(a.date));
    }, [insightsData]);

    return (
        <div className='insights-container'>
            <div className='insights-header'>
                <p>Insights</p>

                <div className='insights-header-right-content'>
                    <div className='insights-search-row'>
                        <SearchBar
                            searchText={searchInsightInputValue}
                            onSearchTextChange={setSearchInsightInputValue}
                            activeFilters={activeFilters}
                            setActiveFilters={setActiveFilters}
                            availableFilters={AVAILABLE_FILTERS}
                            placeholder="Search Insight..."
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

                    <div className='insights-filters-row'>
                        <InsightsCalendarPopover 
                            applyDateRangeFilter={setDateRangeFilter} 
                            currentDateRange={dateRangeFilter}
                            onResetDateRange={() => setDateRangeFilter(INITIAL_DATE_RANGE)}
                        />
                    </div>
                </div>
            </div>

            <div className='insights-list-container'>
                {errorInsights ? (
                    <div className='empty-insights-container'>
                        <p className='empty-insights-text'>
                            Unable to load insights. Please try again later.
                        </p>
                    </div>
                ) : (isLoadingInsights && insights.length === 0) || isRefetchingInsights ? (
                    <InsightsListSkeleton />
                ) : insights.length > 0 ? (
                    <>
                        {insights.map(({ date, insights: groupInsights }) => {
                            return (
                                <InsightCollapsibleTable 
                                    key={date}
                                    groupDate={date} 
                                    groupInsights={groupInsights}
                                    openedInsights={openedInsights} 
                                    setOpenedInsights={setOpenedInsights}
                                />
                            )
                        })}
                        {hasNextPage && (
                            <button
                                className='load-more-insights-button'
                                onClick={() => fetchNextPage()}
                                disabled={isFetchingNextPage}
                            >
                                {isFetchingNextPage ? 'Loading...' : 'Load more'}
                            </button>
                        )}
                    </>
                ) : (
                    <div className='empty-insights-container'>
                        <p className='empty-insights-text'>
                            {insights.length === 0 ? 'No Insights yet.' : 'No results found...'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
