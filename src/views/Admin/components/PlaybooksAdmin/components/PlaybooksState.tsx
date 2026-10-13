import { FileText, Upload } from 'lucide-react';
import clsx from 'clsx';
import { Button } from '@/components/ds/Button';
import '../styles/PlaybooksState.css';

type Props =
    | { state: 'loading' }
    | { state: 'error'; onRetry: () => void; isRetrying: boolean }
    | { state: 'empty'; onUpload: () => void };

/** Replaces the table while there are no rows to show. */
export default function PlaybooksState(props: Props) {
    return (
        <div className={clsx('playbooks-state', `playbooks-state--${props.state}`)} role={props.state === 'error' ? 'alert' : 'status'}>
            {props.state === 'loading' && (
                <>
                    <span className='playbooks-state__spinner' aria-hidden='true' />
                    Loading playbooks…
                </>
            )}
            {props.state === 'error' && (
                <>
                    Couldn't load playbooks.
                    <Button variant='secondary' size='sm' onClick={props.onRetry} loading={props.isRetrying}>
                        Try again
                    </Button>
                </>
            )}
            {props.state === 'empty' && (
                <>
                    <span className='playbooks-state__icon' aria-hidden='true'>
                        <FileText size={24} />
                    </span>
                    <span className='playbooks-state__title'>No public playbooks yet</span>
                    Upload a script to make it available to every Sayso user.
                    <Button size='sm' leftIcon={<Upload size={16} />} onClick={props.onUpload}>
                        Upload playbook
                    </Button>
                </>
            )}
        </div>
    );
}
