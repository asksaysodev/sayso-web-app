import { LuX, LuChevronDown } from 'react-icons/lu';
import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { NotificationActiveFilter, NotificationStatus, NotificationType } from '@/types/notifications';

const STATUS_OPTIONS: (NotificationStatus | 'all')[] = ['all', 'active', 'paused', 'expired'];
const TYPE_OPTIONS: NotificationType[] = ['media', 'article'];

interface Props {
    filter: NotificationActiveFilter;
    onUpdate: (filter: NotificationActiveFilter) => void;
    onRemove: () => void;
}

export default function NotificationFilterPill({ filter, onUpdate, onRemove }: Props) {
    const [open, setOpen] = useState(false);

    const options = filter.key === 'status' ? STATUS_OPTIONS : TYPE_OPTIONS;

    return (
        <div className="search-filter-pill">
            <span className="filter-pill-label">{filter.key}</span>
            <span className="filter-pill-is">is</span>

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <button className="filter-pill-selector" onClick={(e) => e.stopPropagation()}>
                        {filter.value}
                        <LuChevronDown size={10} />
                    </button>
                </PopoverTrigger>
                <PopoverContent className="filter-dropdown w-32" align="start">
                    {options.map((opt) => (
                        <button
                            key={opt}
                            className={`filter-dropdown-item ${filter.value === opt ? 'active' : ''}`}
                            onClick={() => {
                                onUpdate({ ...filter, value: opt } as NotificationActiveFilter);
                                setOpen(false);
                            }}
                        >
                            {opt}
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
