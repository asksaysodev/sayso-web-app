import { useRef, type MouseEvent } from 'react';
import { Search } from 'lucide-react';
import { Chip } from '@/components/ds/Chip';

export interface SearchChip {
    key: string;
    label: string;
    onRemove: () => void;
}

interface Props {
    searchText: string;
    onSearchTextChange: (text: string) => void;
    chips: SearchChip[];
    placeholder?: string;
}

/** Keyword search with the applied filters shown as chips. Filters themselves live in the Filters drawer. */
export default function ConversationsSearchBar({ searchText, onSearchTextChange, chips, placeholder = 'Search...' }: Props) {
    const inputRef = useRef<HTMLInputElement>(null);

    const focusInput = (event: MouseEvent<HTMLDivElement>) => {
        if ((event.target as HTMLElement).closest('button')) return;
        inputRef.current?.focus();
    };

    return (
        <div className='conversations-search' onClick={focusInput}>
            <Search size={16} className='conversations-search__icon' aria-hidden />
            {chips.map((chip) => (
                <Chip key={chip.key} label={chip.label} onRemove={chip.onRemove} className='conversations-search__chip' />
            ))}
            <input
                ref={inputRef}
                type='search'
                className='conversations-search__input'
                placeholder={placeholder}
                aria-label='Search conversations'
                value={searchText}
                onChange={(event) => onSearchTextChange(event.target.value)}
            />
        </div>
    );
}
