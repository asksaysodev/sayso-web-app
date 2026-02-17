import { ActiveFilter } from '../types';
import StageFitPill from './StageFitPill';

interface Props {
    filter: ActiveFilter;
    onUpdate: (filter: ActiveFilter) => void;
    onRemove: () => void;
}

export default function FilterPill({ filter, onUpdate, onRemove }: Props) {
    switch (filter.key) {
        case 'stage_fit':
            return (
                <StageFitPill
                    filter={filter}
                    onUpdate={onUpdate}
                    onRemove={onRemove}
                />
            );
        default:
            return null;
    }
}
