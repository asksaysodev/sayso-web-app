import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ds/Button';

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

    return (
        <footer className='dashboard-tips__footer'>
            <span className='dashboard-tips__range'>{total === 0 ? '0 of 0' : `${range} of ${total}`}</span>
            <div className='dashboard-tips__nav'>
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
            </div>
        </footer>
    );
}
