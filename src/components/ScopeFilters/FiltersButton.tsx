import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ds/Button';
import './ScopeFilters.css';

interface Props {
    onClick: () => void;
}

export default function FiltersButton({ onClick }: Props) {
    return (
        <Button
            variant='secondary'
            className='scope-filters-button'
            leftIcon={<SlidersHorizontal size={20} />}
            onClick={onClick}
        >
            Filters
        </Button>
    );
}
