import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ds/Button';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface Props {
    /** Zero-based index of the first tip on the page. */
    start: number;
    pageSize: number;
    total: number;
    onBack: () => void;
    onNext: () => void;
}

export default function TipsPagination({ start, pageSize, total, onBack, onNext }: Props) {
    const end = Math.min(start + pageSize, total);
    const range = end - start > 1 ? `${start + 1}-${end}` : `${end}`;
    // Phones get arrow-only buttons (Figma mobile frame).
    const isMobile = useMediaQuery('(max-width: 767px)');

    return (
        <footer className='dashboard-tips__footer'>
            <span className='dashboard-tips__range'>{total === 0 ? '0 of 0' : `${range} of ${total}`}</span>
            <div className='dashboard-tips__nav'>
                {isMobile ? (
                    <>
                        <Button
                            variant='secondary'
                            size='icon'
                            className='dashboard-tips__back'
                            aria-label='Previous tip'
                            disabled={start === 0}
                            onClick={onBack}
                        >
                            <ArrowLeft size={20} />
                        </Button>
                        <Button
                            size='icon'
                            className='dashboard-tips__next'
                            aria-label='Next tip'
                            disabled={end >= total}
                            onClick={onNext}
                        >
                            <ArrowRight size={20} />
                        </Button>
                    </>
                ) : (
                    <>
                        <Button
                            variant='secondary'
                            size='sm'
                            className='dashboard-tips__back'
                            leftIcon={<ArrowLeft size={16} />}
                            disabled={start === 0}
                            onClick={onBack}
                        >
                            Back
                        </Button>
                        <Button
                            size='sm'
                            className='dashboard-tips__next'
                            disabled={end >= total}
                            onClick={onNext}
                        >
                            Next
                            <ArrowRight size={20} />
                        </Button>
                    </>
                )}
            </div>
        </footer>
    );
}
