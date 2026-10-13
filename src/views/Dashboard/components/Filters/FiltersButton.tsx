import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ds/Button';

interface Props {
    onClick: () => void;
}

export default function FiltersButton({ onClick }: Props) {
    return (
        <Button
            variant='secondary'
            className='dashboard-filters-button'
            leftIcon={<SlidersHorizontal size={20} />}
            onClick={onClick}
        >
            Filters
        </Button>
    );
}
