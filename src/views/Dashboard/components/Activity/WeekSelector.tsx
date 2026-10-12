import dayjs from 'dayjs';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ds/Button';
import type { DashboardActivity } from '../../types';

interface Props {
    activity: DashboardActivity | null;
    onPrevious: () => void;
    onNext: () => void;
}

export default function WeekSelector({ activity, onPrevious, onNext }: Props) {
    return (
        <div className='dashboard-week-selector'>
            <Button
                variant='secondary'
                size='icon'
                className='dashboard-week-selector__button'
                aria-label='Previous week'
                disabled={!activity?.hasPreviousWeek}
                onClick={onPrevious}
            >
                <ChevronLeft size={16} />
            </Button>
            {activity ? (
                <span className='dashboard-week-selector__label'>
                    {dayjs(activity.startDate).format('MMM D')} - {dayjs(activity.endDate).format('MMM D')}
                </span>
            ) : (
                <span className='skeleton dashboard-week-selector__label-skeleton' />
            )}
            <Button
                variant='secondary'
                size='icon'
                className='dashboard-week-selector__button'
                aria-label='Next week'
                disabled={!activity?.hasNextWeek}
                onClick={onNext}
            >
                <ChevronRight size={16} />
            </Button>
        </div>
    );
}
