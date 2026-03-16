import { Dispatch, ReactNode, SetStateAction, useState } from 'react';
import { LuSearch } from 'react-icons/lu';
import { InputGroup, InputGroupInput, InputGroupAddon } from '@/components/ui/input-group';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import '@/styles/SearchBar.css';

export interface SearchFilterConfig<TFilter extends { key: string }> {
    key: TFilter['key'];
    label: string;
    description: string;
    defaultValue: () => TFilter;
}

interface Props<TFilter extends { key: string }> {
    searchText: string;
    onSearchTextChange: (text: string) => void;
    activeFilters: TFilter[];
    setActiveFilters: Dispatch<SetStateAction<TFilter[]>>;
    availableFilters: SearchFilterConfig<TFilter>[];
    filterPillRenderers: Partial<Record<TFilter['key'], (filter: TFilter, onUpdate: (filter: TFilter) => void, onRemove: () => void) => ReactNode>>;
    placeholder?: string;
}

export default function SearchBar<TFilter extends { key: string }>({
    searchText,
    onSearchTextChange,
    activeFilters = [],
    setActiveFilters,
    availableFilters,
    filterPillRenderers,
    placeholder = 'Search...',
}: Props<TFilter>) {
    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

    const availableFilterOptions = (availableFilters ?? []).filter(
        config => !activeFilters.some(af => af.key === config.key)
    );

    const handleAddFilter = (key: string) => {
        const config = availableFilters.find(f => f.key === key);
        if (config) {
            setActiveFilters(prev => [...prev, config.defaultValue()]);
        }
        setIsFilterDropdownOpen(false);
    };

    const handleUpdateFilter = (updatedFilter: TFilter) => {
        setActiveFilters(prev =>
            prev.map(f => f.key === updatedFilter.key ? updatedFilter : f)
        );
    };

    const handleRemoveFilter = (key: string) => {
        setActiveFilters(prev => prev.filter(f => f.key !== key));
    };

    const hasActiveFilters = activeFilters.length > 0;
    const hasAvailableFilters = availableFilterOptions.length > 0;

    return (
        <div className="search-bar">
            <Popover
                open={isFilterDropdownOpen}
                onOpenChange={setIsFilterDropdownOpen}
            >
                <PopoverTrigger asChild>
                    <div className="search-bar-input-wrapper">
                        <InputGroup className="!h-10">
                            <InputGroupAddon>
                                <LuSearch size={16} />
                            </InputGroupAddon>

                            {activeFilters.map(filter => {
                                const renderer = filterPillRenderers[filter.key as TFilter['key']];
                                if (!renderer) return null;
                                return (
                                    <span key={filter.key}>
                                        {renderer(filter, handleUpdateFilter, () => handleRemoveFilter(filter.key))}
                                    </span>
                                );
                            })}

                            <InputGroupInput
                                placeholder={hasActiveFilters ? 'Search...' : placeholder}
                                value={searchText}
                                onChange={(e) => onSearchTextChange(e.target.value)}
                                className="!h-10"
                            />
                        </InputGroup>
                    </div>
                </PopoverTrigger>

                {hasAvailableFilters && (
                    <PopoverContent
                        className="search-filter-options"
                        align="start"
                        onOpenAutoFocus={(e) => e.preventDefault()}
                    >
                        {availableFilterOptions.map(config => (
                            <button
                                key={config.key}
                                className="search-filter-option"
                                onClick={() => handleAddFilter(config.key)}
                            >
                                <span className="search-filter-option-label">{config.label}</span>
                                <span className="search-filter-option-description">{config.description}</span>
                            </button>
                        ))}
                    </PopoverContent>
                )}
            </Popover>
        </div>
    );
}
