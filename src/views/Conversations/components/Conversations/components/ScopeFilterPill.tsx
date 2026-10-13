import { LuChevronDown, LuX } from 'react-icons/lu';

interface Props {
    label: string;
    value: string;
    onOpen: () => void;
    onRemove: () => void;
}

export default function ScopeFilterPill({ label, value, onOpen, onRemove }: Props) {
    return (
        <div className="search-filter-pill">
            <span className="filter-pill-label">{label}</span>
            <button
                className="filter-pill-selector scope-filter-pill-selector"
                onClick={(e) => { e.stopPropagation(); onOpen(); }}
            >
                {value}
                <LuChevronDown size={10} />
            </button>
            <button
                className="filter-pill-remove"
                onClick={(e) => { e.stopPropagation(); onRemove(); }}
                aria-label={`Remove ${label} filter`}
            >
                <LuX size={12} />
            </button>
        </div>
    );
}
