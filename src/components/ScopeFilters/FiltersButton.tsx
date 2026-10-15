import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ds/Button';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import './ScopeFilters.css';

interface Props {
    onClick: () => void;
}

export default function FiltersButton({ onClick }: Props) {
    const isMobile = useMediaQuery('(max-width: 767px)');

    if (isMobile) {
        return (
            <Button
                variant='secondary'
                size='icon'
                className='scope-filters-button scope-filters-button--icon'
                aria-label='Filters'
                onClick={onClick}
            >
                <SlidersHorizontal size={20} />
            </Button>
        );
    }

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
