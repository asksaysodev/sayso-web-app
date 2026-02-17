import { LuX } from "react-icons/lu";
import dayjs from "dayjs";
import { DateRange } from "react-day-picker";
import type { LeadTypeFilter } from "@/types/coach";

interface ActiveFiltersProps {
    selectedLeadTypeFilter: LeadTypeFilter;
    searchInsightInputValue: string;
    dateRangeFilter: DateRange | undefined;
    onClearLeadType: () => void;
    onClearSearch: () => void;
    onClearDateRange: () => void;
}

export default function ActiveFilters({
    selectedLeadTypeFilter,
    searchInsightInputValue,
    dateRangeFilter,
    onClearLeadType,
    onClearSearch,
    onClearDateRange,
}: ActiveFiltersProps) {
    const hasActiveFilters = 
        selectedLeadTypeFilter !== 'all' || 
        searchInsightInputValue.trim() || 
        dateRangeFilter?.from;

    if (!hasActiveFilters) return null;

    return (
        <div className="sort-by-container">
            <span className="filter-label">Active filters:</span>
            <div className="filter-tags">
                {selectedLeadTypeFilter !== 'all' && (
                    <span className="filter-tag">
                        <span className="filter-tag-content">
                            Lead Type: <strong>{selectedLeadTypeFilter.charAt(0).toUpperCase() + selectedLeadTypeFilter.slice(1)}</strong>
                        </span>
                        <button 
                            className="filter-tag-clear" 
                            onClick={onClearLeadType}
                            aria-label="Clear lead type filter"
                        >
                            <LuX />
                        </button>
                    </span>
                )}
                {searchInsightInputValue.trim() && (
                    <span className="filter-tag">
                        <span className="filter-tag-content">
                            Search: <strong>"{searchInsightInputValue.trim()}"</strong>
                        </span>
                        <button 
                            className="filter-tag-clear" 
                            onClick={onClearSearch}
                            aria-label="Clear search filter"
                        >
                            <LuX />
                        </button>
                    </span>
                )}
                {dateRangeFilter?.from && (
                    <span className="filter-tag">
                        <span className="filter-tag-content">
                            Date: <strong>
                                {dayjs(dateRangeFilter.from).format('MMM D, YYYY')}
                                {dateRangeFilter.to ? ` - ${dayjs(dateRangeFilter.to).format('MMM D, YYYY')}` : '+'}
                            </strong>
                        </span>
                        <button 
                            className="filter-tag-clear" 
                            onClick={onClearDateRange}
                            aria-label="Clear date range filter"
                        >
                            <LuX />
                        </button>
                    </span>
                )}
            </div>
        </div>
    );
}

