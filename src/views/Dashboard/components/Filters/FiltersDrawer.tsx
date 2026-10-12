import { useMemo, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ds/Button';
import { Chip } from '@/components/ds/Chip';
import { Sheet, SheetBody, SheetFooter, SheetHeader } from '@/components/ds/Sheet';
import SearchBar from '@/components/ui/search-bar';
import type { DashboardSelection, FilterOption, FilterOptionList } from '../../types';
import findSelectionLabel from '../../utils/findSelectionLabel';
import FiltersSection from './FiltersSection';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selection: DashboardSelection | null;
    onApply: (selection: DashboardSelection | null) => void;
    teams: FilterOptionList;
    members: FilterOptionList;
}

const matching = (options: FilterOption[], query: string) =>
    query ? options.filter((option) => option.label.toLowerCase().includes(query)) : options;

/**
 * Draft is local until Apply; it is re-seeded from the applied selection every time the drawer opens.
 */
export default function FiltersDrawer({ open, onOpenChange, selection, onApply, teams, members }: Props) {
    const [draft, setDraft] = useState(selection);
    const [searchText, setSearchText] = useState('');
    const [wasOpen, setWasOpen] = useState(open);

    if (open !== wasOpen) {
        setWasOpen(open);
        if (open) {
            setDraft(selection);
            setSearchText('');
        }
    }

    const query = searchText.trim().toLowerCase();
    const shownTeams = useMemo(() => matching(teams.options, query), [teams.options, query]);
    const shownMembers = useMemo(() => matching(members.options, query), [members.options, query]);
    const draftLabel = findSelectionLabel(draft, teams.options, members.options);

    const apply = (next: DashboardSelection | null) => {
        onApply(next);
        onOpenChange(false);
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetHeader icon={<SlidersHorizontal size={28} />} title='Filters' />
            <SheetBody>
                {draftLabel && (
                    <div className='dashboard-filters__draft'>
                        <Chip label={draftLabel} onRemove={() => setDraft(null)} />
                    </div>
                )}
                <div className='dashboard-filters__search'>
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
                <button type='button' className='dashboard-filters__clear' onClick={() => apply(null)}>
                    Clear all
                </button>
                <Button className='dashboard-filters__apply' onClick={() => apply(draft)}>
                    Apply filters
                </Button>
            </SheetFooter>
        </Sheet>
    );
}
