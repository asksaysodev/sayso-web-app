import { Dispatch, SetStateAction, useState } from 'react';
import { LuSearch } from 'react-icons/lu';
import { InputGroup, InputGroupInput, InputGroupAddon } from '@/components/ui/input-group';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { ActiveFilter, FilterConfig } from '../types';
import FilterPill from './FilterPill';

const AVAILABLE_FILTERS: FilterConfig[] = [
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
    setActiveFilters
}: Props) {
    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

    const availableFilterOptions = AVAILABLE_FILTERS.filter(
        config => !activeFilters.some(af => af.key === config.key)
    );

    const handleAddFilter = (key: ActiveFilter['key']) => {
        const config = AVAILABLE_FILTERS.find(f => f.key === key);
        if (config) {
            setActiveFilters(prev => [...prev, config.defaultValue()]);
        }
        setIsFilterDropdownOpen(false);
    };

    const handleUpdateFilter = (updatedFilter: ActiveFilter) => {
        setActiveFilters(prev =>
            prev.map(f => f.key === updatedFilter.key ? updatedFilter : f)
        );
    };

    const handleRemoveFilter = (key: ActiveFilter['key']) => {
        setActiveFilters(prev => prev.filter(f => f.key !== key));
    };

    const hasActiveFilters = activeFilters.length > 0;
    const hasAvailableFilters = availableFilterOptions.length > 0;

    return (
        <div className="signal-search-bar">
            <Popover
                open={isFilterDropdownOpen}
                onOpenChange={setIsFilterDropdownOpen}
            >
                <PopoverTrigger asChild>
                    <div className="signal-search-bar-input-wrapper">
                        <InputGroup className="!h-10">
                            <InputGroupAddon>
                                <LuSearch size={16} />
                            </InputGroupAddon>

                            {activeFilters.map(filter => (
                                <FilterPill
                                    key={filter.key}
                                    filter={filter}
                                    onUpdate={handleUpdateFilter}
                                    onRemove={() => handleRemoveFilter(filter.key)}
                                />
                            ))}

                            <InputGroupInput
                                placeholder={hasActiveFilters ? 'Search...' : 'Search signals by name or content'}
                                value={searchText}
                                onChange={(e) => onSearchTextChange(e.target.value)}
                                className="!h-10"
                            />
                        </InputGroup>
                    </div>
                </PopoverTrigger>

                {hasAvailableFilters && (
                    <PopoverContent
                        className="signal-filter-options"
                        align="start"
                        onOpenAutoFocus={(e) => e.preventDefault()}
                    >
                        {availableFilterOptions.map(config => (
                            <button
                                key={config.key}
                                className="signal-filter-option"
                                onClick={() => handleAddFilter(config.key)}
                            >
                                <span className="signal-filter-option-label">{config.label}</span>
                                <span className="signal-filter-option-description">{config.description}</span>
                            </button>
                        ))}
                    </PopoverContent>
                )}
            </Popover>
        </div>
    );
}
