import { useState } from 'react';
import { LuX, LuChevronDown } from 'react-icons/lu';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

interface FilterPillProps<TFilter extends { key: string; value: string }> {
    label: string;
    options: TFilter['value'][];
    filter: TFilter;
    onUpdate: (filter: TFilter) => void;
    onRemove: () => void;
}

export default function FilterPill<TFilter extends { key: string; value: string }>({
    label,
    options,
    filter,
    onUpdate,
    onRemove,
}: FilterPillProps<TFilter>) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="search-filter-pill">
            <span className="filter-pill-label">{label}</span>

            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <button className="filter-pill-selector" onClick={(e) => e.stopPropagation()}>
                        {filter.value}
                        <LuChevronDown size={10} />
                    </button>
                </PopoverTrigger>
                <PopoverContent className="filter-dropdown w-28" align="start">
                    {options.map((v) => (
                        <button
                            key={v}
                            className={`filter-dropdown-item ${filter.value === v ? 'active' : ''}`}
                            onClick={() => { onUpdate({ ...filter, value: v }); setIsOpen(false); }}
                        >
                            {v}
                        </button>
                    ))}
                </PopoverContent>
            </Popover>

            <button className="filter-pill-remove" onClick={onRemove}>
                <LuX size={12} />
            </button>
        </div>
    );
}
