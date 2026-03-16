import { Dispatch, SetStateAction } from 'react';
import SearchBar, { SearchFilterConfig } from '@/components/ui/search-bar';
import { ActiveFilter } from '../types';
import FilterPill from './FilterPill';

const AVAILABLE_FILTERS: SearchFilterConfig<ActiveFilter>[] = [
    {
        key: 'stage_fit',
        label: 'stage_fit',
        description: 'Filter by stage fit value',
        defaultValue: () => ({ key: 'stage_fit', stage: 'connect', value: 'Primary' }),
    },
];

interface Props {
    searchText: string;
    onSearchTextChange: (text: string) => void;
    activeFilters: ActiveFilter[];
    setActiveFilters: Dispatch<SetStateAction<ActiveFilter[]>>;
}

export default function SignalSearchBar({
    searchText,
    onSearchTextChange,
    activeFilters,
    setActiveFilters,
}: Props) {
    return (
        <SearchBar
            searchText={searchText}
            onSearchTextChange={onSearchTextChange}
            activeFilters={activeFilters}
            setActiveFilters={setActiveFilters}
            availableFilters={AVAILABLE_FILTERS}
            placeholder="Search signals by name or content"
            filterPillRenderers={{
                stage_fit: (filter, onUpdate, onRemove) => (
                    <FilterPill filter={filter} onUpdate={onUpdate} onRemove={onRemove} />
                )
            }}
        />
    );
}
