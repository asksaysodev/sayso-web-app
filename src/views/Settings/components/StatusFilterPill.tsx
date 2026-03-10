import { useState } from 'react';
import { LuX, LuChevronDown } from 'react-icons/lu';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { MemberStatusFilter, MemberStatusFilterValue } from '../types';

const STATUS_VALUES: MemberStatusFilterValue[] = ['active', 'pending', 'expired', 'revoked'];

interface Props {
    filter: MemberStatusFilter;
    onUpdate: (filter: MemberStatusFilter) => void;
    onRemove: () => void;
}

export default function StatusFilterPill({ filter, onUpdate, onRemove }: Props) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="search-filter-pill">
            <span className="filter-pill-label">status</span>

            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <button className="filter-pill-selector" onClick={(e) => e.stopPropagation()}>
                        {filter.value}
                        <LuChevronDown size={10} />
                    </button>
                </PopoverTrigger>
                <PopoverContent className="filter-dropdown w-28" align="start">
                    {STATUS_VALUES.map((v) => (
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
