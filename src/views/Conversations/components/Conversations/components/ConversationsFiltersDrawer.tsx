import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ds/Button';
import { Checkbox } from '@/components/ds/Checkbox';
import { Radio } from '@/components/ds/Radio';
import { Sheet, SheetBody, SheetFooter, SheetHeader } from '@/components/ds/Sheet';
import ScopeFilterSections from '@/components/ScopeFilters/ScopeFilterSections';
import type { FilterOptionList, ScopeSelection } from '@/types/scope';
import {
    APPOINTMENT_OPTIONS,
    CLEARED_CONVERSATION_FILTERS,
    LEAD_TYPE_OPTIONS,
    type ConversationFilterState,
} from '../../../utils/conversationFilters';
import '@/components/ScopeFilters/ScopeFilters.css';

export interface ConversationsFiltersApply {
    filters: ConversationFilterState;
    selection: ScopeSelection | null;
}

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    filters: ConversationFilterState;
    onApply: (next: ConversationsFiltersApply) => void;
    /** Admins also get the Team / Members scope sections. */
    scope?: {
        selection: ScopeSelection | null;
        teams: FilterOptionList;
        members: FilterOptionList;
    };
}

export default function ConversationsFiltersDrawer({ open, onOpenChange, filters, onApply, scope }: Props) {
    const apply = (next: ConversationsFiltersApply) => {
        onApply(next);
        onOpenChange(false);
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetHeader icon={<SlidersHorizontal size={28} />} title='Filters' />
            <DrawerContent filters={filters} scope={scope} onApply={apply} />
        </Sheet>
    );
}

/** Radix unmounts this on close, so the draft re-seeds from the applied filters on every open. */
function DrawerContent({ filters, scope, onApply }: Pick<Props, 'filters' | 'scope' | 'onApply'>) {
    const [draft, setDraft] = useState(filters);
    const [scopeDraft, setScopeDraft] = useState(scope?.selection ?? null);

    const update = (patch: Partial<ConversationFilterState>) => setDraft((prev) => ({ ...prev, ...patch }));

    return (
        <>
            <SheetBody>
                <section className='scope-filters__section' aria-label='Summary'>
                    <h3 className='scope-filters__section-title'>Summary</h3>
                    <Checkbox
                        label='Summary created'
                        checked={draft.hasSummary}
                        onChange={(event) => update({ hasSummary: event.target.checked })}
                    />
                </section>
                <section className='scope-filters__section' aria-label='Lead type'>
                    <h3 className='scope-filters__section-title'>Lead type</h3>
                    <div className='scope-filters__options'>
                        {LEAD_TYPE_OPTIONS.map((option) => (
                            <Radio
                                key={option.value}
                                name='conversation-lead-type'
                                label={option.label}
                                checked={draft.leadType === option.value}
                                onChange={() => update({ leadType: option.value })}
                            />
                        ))}
                    </div>
                </section>
                <section className='scope-filters__section' aria-label='Appointment'>
                    <h3 className='scope-filters__section-title'>Appointment</h3>
                    <div className='scope-filters__options'>
                        {APPOINTMENT_OPTIONS.map((option) => (
                            <Radio
                                key={option.value}
                                name='conversation-appointment'
                                label={option.label}
                                checked={draft.appointment === option.value}
                                onChange={() => update({ appointment: option.value })}
                            />
                        ))}
                    </div>
                </section>
                {scope && (
                    <ScopeFilterSections
                        draft={scopeDraft}
                        onSelect={setScopeDraft}
                        teams={scope.teams}
                        members={scope.members}
                        searchable={false}
                    />
                )}
            </SheetBody>
            <SheetFooter>
                <button
                    type='button'
                    className='scope-filters__clear'
                    onClick={() => onApply({ filters: CLEARED_CONVERSATION_FILTERS, selection: null })}
                >
                    Clear all
                </button>
                <Button className='scope-filters__apply' onClick={() => onApply({ filters: draft, selection: scopeDraft })}>
                    Apply filters
                </Button>
            </SheetFooter>
        </>
    );
}
