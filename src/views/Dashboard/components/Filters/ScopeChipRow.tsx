import { Chip } from '@/components/ds/Chip';

interface Props {
    label: string;
    onClear: () => void;
}

export default function ScopeChipRow({ label, onClear }: Props) {
    return (
        <div className='dashboard-scope-chips'>
            <Chip label={label} onRemove={onClear} />
            <button type='button' className='dashboard-scope-chips__clear' onClick={onClear}>
                Clear filters
            </button>
        </div>
    );
}
