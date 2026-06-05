import { useEffect, useState } from 'react';
import { LuX } from 'react-icons/lu';
import useDebounce from '@/hooks/useDebounce';
import '@/styles/SearchBar.css';

interface Props<TFilter extends { key: string; value: string }> {
    label: string;
    filter: TFilter;
    onUpdate: (filter: TFilter) => void;
    onRemove: () => void;
    placeholder?: string;
}

export default function TextFilterPill<TFilter extends { key: string; value: string }>({
    label,
    filter,
    onUpdate,
    onRemove,
    placeholder = 'type to search…',
}: Props<TFilter>) {
    const [inputValue, setInputValue] = useState(filter.value);
    const debouncedValue = useDebounce(inputValue, 400);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        onUpdate({ ...filter, value: debouncedValue } as TFilter);
    }, [debouncedValue]);

    return (
        <div className="search-filter-pill">
            <span className="filter-pill-label">{label}:</span>
            <input
                className="filter-pill-input"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder={placeholder}
                autoFocus
                onClick={e => e.stopPropagation()}
            />
            <button className="filter-pill-remove" onClick={onRemove}>
                <LuX size={12} />
            </button>
        </div>
    );
}
