import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { CompanyMemberStatus, StatusFilter } from '../types';
import statusBadge from '../utils/statusBadge';

const STATUS_VALUES: CompanyMemberStatus[] = ['active', 'pending', 'expired'];

interface Props {
    filter: StatusFilter;
    onUpdate: (filter: StatusFilter) => void;
    onRemove: () => void;
}

export default function StatusFilterPill({ filter, onUpdate, onRemove }: Props) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className='search-filter-pill'>
            <span className='filter-pill-label'>status</span>

            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <button type='button' className='filter-pill-selector' onClick={(e) => e.stopPropagation()}>
                        {statusBadge(filter.value).label}
                        <ChevronDown size={10} />
                    </button>
                </PopoverTrigger>
                <PopoverContent className='filter-dropdown w-28' align='start'>
                    {STATUS_VALUES.map((value) => (
                        <button
                            key={value}
                            type='button'
                            className={`filter-dropdown-item ${filter.value === value ? 'active' : ''}`}
                            onClick={() => {
                                onUpdate({ ...filter, value });
                                setIsOpen(false);
                            }}
                        >
                            {statusBadge(value).label}
                        </button>
                    ))}
                </PopoverContent>
            </Popover>

            <button type='button' className='filter-pill-remove' onClick={onRemove} aria-label='Remove status filter'>
                <X size={12} />
            </button>
        </div>
    );
}
