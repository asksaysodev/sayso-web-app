import { useMemo, useState } from 'react';
import SearchBar from '@/components/ui/search-bar';
import type { FilterOption, FilterOptionList, ScopeSelection } from '@/types/scope';
import FiltersSection from './FiltersSection';

interface Props {
    draft: ScopeSelection | null;
    onSelect: (selection: ScopeSelection) => void;
    teams: FilterOptionList;
    members: FilterOptionList;
    /** Show the search box above the sections. */
    searchable?: boolean;
}

const matching = (options: FilterOption[], query: string) => {
    return query ? options.filter((option) => option.label.toLowerCase().includes(query)) : options;
}

/** Team + Members radio sections with a shared search box. */
export default function ScopeFilterSections({ draft, onSelect, teams, members, searchable = true }: Props) {
    const [searchText, setSearchText] = useState('');

    const query = searchText.trim().toLowerCase();
    const shownTeams = useMemo(() => matching(teams.options, query), [teams.options, query]);
    const shownMembers = useMemo(() => matching(members.options, query), [members.options, query]);

    return (
        <>
            {searchable && (
                <div className='scope-filters__search'>
                    <SearchBar
                        searchText={searchText}
                        onSearchTextChange={setSearchText}
                        placeholder='Search team or members'
                    />
                </div>
            )}
            <FiltersSection
                title='Team'
                noun='teams'
                scope='team'
                list={teams}
                shownOptions={shownTeams}
                isSearching={query !== ''}
                draft={draft}
                onSelect={onSelect}
            />
            <FiltersSection
                title='Members'
                noun='members'
                scope='account'
                list={members}
                shownOptions={shownMembers}
                isSearching={query !== ''}
                draft={draft}
                onSelect={onSelect}
            />
        </>
    );
}
