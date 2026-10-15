import { useMemo, useState } from 'react';
import { Button } from '@/components/ds/Button';
import { Chip } from '@/components/ds/Chip';
import { SheetBody, SheetFooter } from '@/components/ds/Sheet';
import SearchBar from '@/components/ui/search-bar';
import type { FilterOption, FilterOptionList, ScopeSelection } from '@/types/scope';
import findScopeSelectionLabel from '@/utils/findScopeSelectionLabel';
import FiltersSection from './FiltersSection';

interface Props {
    selection: ScopeSelection | null;
    onApply: (selection: ScopeSelection | null) => void;
    teams: FilterOptionList;
    members: FilterOptionList;
}

const matching = (options: FilterOption[], query: string) => {
    return query ? options.filter((option) => option.label.toLowerCase().includes(query)) : options;
}

/** Radix unmounts this on close, so the draft re-seeds from `selection` on every open. */
export default function FiltersDrawerContent({ selection, onApply, teams, members }: Props) {
    const [draft, setDraft] = useState(selection);
    const [searchText, setSearchText] = useState('');

    const query = searchText.trim().toLowerCase();
    const shownTeams = useMemo(() => matching(teams.options, query), [teams.options, query]);
    const shownMembers = useMemo(() => matching(members.options, query), [members.options, query]);
    const draftLabel = findScopeSelectionLabel(draft, teams.options, members.options);

    return (
        <>
            <SheetBody>
                {draftLabel && (
                    <div className='scope-filters__draft'>
                        <Chip label={draftLabel} onRemove={() => setDraft(null)} />
                    </div>
                )}
                <div className='scope-filters__search'>
                    <SearchBar
                        searchText={searchText}
                        onSearchTextChange={setSearchText}
                        placeholder='Search team or members'
                    />
                </div>
                <FiltersSection
                    title='Team'
                    noun='teams'
                    scope='team'
                    list={teams}
                    shownOptions={shownTeams}
                    isSearching={query !== ''}
                    draft={draft}
                    onSelect={setDraft}
                />
                <FiltersSection
                    title='Members'
                    noun='members'
                    scope='account'
                    list={members}
                    shownOptions={shownMembers}
                    isSearching={query !== ''}
                    draft={draft}
                    onSelect={setDraft}
                />
            </SheetBody>
            <SheetFooter>
                <button type='button' className='scope-filters__clear' onClick={() => onApply(null)}>
                    Clear all
                </button>
                <Button className='scope-filters__apply' onClick={() => onApply(draft)}>
                    Apply filters
                </Button>
            </SheetFooter>
        </>
    );
}
