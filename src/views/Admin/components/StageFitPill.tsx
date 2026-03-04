import { useState } from 'react';
import { LuX, LuChevronDown } from 'react-icons/lu';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { ActiveFilter, SignalStageFitKey, SignalStageFitValue, StageFitFilter } from '../types';

const STAGES: SignalStageFitKey[] = ['connect', 'discover', 'convert'];
const STAGE_FIT_VALUES: SignalStageFitValue[] = ['Primary', 'Lower', 'Allowed'];

interface Props {
    filter: StageFitFilter;
    onUpdate: (filter: ActiveFilter) => void;
    onRemove: () => void;
}

export default function StageFitPill({ filter, onUpdate, onRemove }: Props) {
    const [isStageDropdownOpen, setIsStageDropdownOpen] = useState(false);
    const [isValueDropdownOpen, setIsValueDropdownOpen] = useState(false);

    const handleStageChange = (stage: SignalStageFitKey) => {
        onUpdate({ ...filter, stage });
        setIsStageDropdownOpen(false);
    };

    const handleValueChange = (value: SignalStageFitValue) => {
        onUpdate({ ...filter, value });
        setIsValueDropdownOpen(false);
    };

    return (
        <div className="search-filter-pill">
            <span className="filter-pill-label">stage_fit</span>

            <Popover open={isStageDropdownOpen} onOpenChange={setIsStageDropdownOpen}>
                <PopoverTrigger asChild>
                    <button className="filter-pill-selector" onClick={(e) => e.stopPropagation()}>
                        {filter.stage}
                        <LuChevronDown size={10} />
                    </button>
                </PopoverTrigger>
                <PopoverContent className="filter-dropdown w-28" align="start">
                    {STAGES.map((stage) => (
                        <button
                            key={stage}
                            className={`filter-dropdown-item ${filter.stage === stage ? 'active' : ''}`}
                            onClick={() => handleStageChange(stage)}
                        >
                            {stage}
                        </button>
                    ))}
                </PopoverContent>
            </Popover>

            <span className="filter-pill-is">is</span>

            <Popover open={isValueDropdownOpen} onOpenChange={setIsValueDropdownOpen}>
                <PopoverTrigger asChild>
                    <button className="filter-pill-selector" onClick={(e) => e.stopPropagation()}>
                        {filter.value}
                        <LuChevronDown size={10} />
                    </button>
                </PopoverTrigger>
                <PopoverContent className="filter-dropdown w-28" align="start">
                    {STAGE_FIT_VALUES.map((value) => (
                        <button
                            key={value}
                            className={`filter-dropdown-item ${filter.value === value ? 'active' : ''}`}
                            onClick={() => handleValueChange(value)}
                        >
                            {value}
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
