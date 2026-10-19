import { useState } from 'react';
import { Button } from '@/components/ds/Button';
import { Chip } from '@/components/ds/Chip';
import { SheetBody, SheetFooter } from '@/components/ds/Sheet';
import type { FilterOptionList, ScopeSelection } from '@/types/scope';
import findScopeSelectionLabel from '@/utils/findScopeSelectionLabel';
import ScopeFilterSections from './ScopeFilterSections';

interface Props {
    selection: ScopeSelection | null;
    onApply: (selection: ScopeSelection | null) => void;
    teams: FilterOptionList;
    members: FilterOptionList;
}

/** Radix unmounts this on close, so the draft re-seeds from `selection` on every open. */
export default function FiltersDrawerContent({ selection, onApply, teams, members }: Props) {
    const [draft, setDraft] = useState(selection);
    const draftLabel = findScopeSelectionLabel(draft, teams.options, members.options);

    return (
        <>
            <SheetBody>
                {draftLabel && (
                    <div className='scope-filters__draft'>
                        <Chip label={draftLabel} onRemove={() => setDraft(null)} />
                    </div>
                )}
                <ScopeFilterSections draft={draft} onSelect={setDraft} teams={teams} members={members} />
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
