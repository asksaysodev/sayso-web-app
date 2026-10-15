import { Button } from '@/components/ds/Button';
import { Radio } from '@/components/ds/Radio';
import type { FilterOption, FilterOptionList, ScopeSelection, ScopeSelectionScope } from '@/types/scope';

interface Props {
    title: string;
    noun: string;
    scope: ScopeSelectionScope;
    list: FilterOptionList;
    shownOptions: FilterOption[];
    isSearching: boolean;
    draft: ScopeSelection | null;
    onSelect: (selection: ScopeSelection) => void;
}

const RADIO_NAME = 'scope-filter';

export default function FiltersSection({ title, noun, scope, list, shownOptions, isSearching, draft, onSelect }: Props) {
    const renderContent = () => {
        if (list.isLoading) return <p className='scope-filters__state'>Loading {noun}…</p>;
        if (list.isError) {
            return (
                <div className='scope-filters__state scope-filters__state--error'>
                    <span>Couldn't load {noun}.</span>
                    <Button variant='secondary' size='sm' onClick={list.retry} loading={list.isRetrying}>
                        Try again
                    </Button>
                </div>
            );
        }
        if (shownOptions.length === 0) {
            return (
                <p className='scope-filters__state'>
                    {isSearching ? `No ${noun} match your search.` : `No ${noun} yet.`}
                </p>
            );
        }

        return (
            <div className='scope-filters__options'>
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
        <section className='scope-filters__section' aria-label={title}>
            <h3 className='scope-filters__section-title'>{title}</h3>
            {renderContent()}
        </section>
    );
}
