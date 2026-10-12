import { Button } from '@/components/ds/Button';
import { Radio } from '@/components/ds/Radio';
import type { DashboardSelection, DashboardSelectionScope, FilterOption, FilterOptionList } from '../../types';

interface Props {
    title: string;
    noun: string;
    scope: DashboardSelectionScope;
    list: FilterOptionList;
    shownOptions: FilterOption[];
    isSearching: boolean;
    draft: DashboardSelection | null;
    onSelect: (selection: DashboardSelection) => void;
}

/** Shared `name` across sections keeps one radio checked in the whole drawer. */
const RADIO_NAME = 'dashboard-filter';

export default function FiltersSection({ title, noun, scope, list, shownOptions, isSearching, draft, onSelect }: Props) {
    const renderContent = () => {
        if (list.isLoading) return <p className='dashboard-filters__state'>Loading {noun}…</p>;
        if (list.isError) {
            return (
                <div className='dashboard-filters__state dashboard-filters__state--error'>
                    <span>Couldn't load {noun}.</span>
                    <Button variant='secondary' size='sm' onClick={list.retry} loading={list.isRetrying}>
                        Try again
                    </Button>
                </div>
            );
        }
        if (shownOptions.length === 0) {
            return (
                <p className='dashboard-filters__state'>
                    {isSearching ? `No ${noun} match your search.` : `No ${noun} yet.`}
                </p>
            );
        }

        return (
            <div className='dashboard-filters__options'>
                {shownOptions.map((option) => (
                    <Radio
                        key={option.id}
                        name={RADIO_NAME}
                        label={option.label}
                        checked={draft?.scope === scope && draft.id === option.id}
                        onChange={() => onSelect({ scope, id: option.id })}
                    />
                ))}
            </div>
        );
    };

    return (
        <section className='dashboard-filters__section' aria-label={title}>
            <h3 className='dashboard-filters__section-title'>{title}</h3>
            {renderContent()}
        </section>
    );
}
