import { CircleAlert, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ds/Button';
import WidgetState from './WidgetState';

interface Props {
    subject: string;
    onRetry: () => void;
    isRetrying: boolean;
}

export default function WidgetErrorState({ subject, onRetry, isRetrying }: Props) {
    return (
        <WidgetState
            icon={<CircleAlert size={32} />}
            tone='error'
            title={`Couldn't load ${subject}`}
            text='Something went wrong on our side. Please try again.'
            action={
                <Button variant='secondary' size='sm' leftIcon={<RefreshCw size={16} />} onClick={onRetry} loading={isRetrying}>
                    Try again
                </Button>
            }
        />
    );
}
