import { CalendarX } from 'lucide-react';
import { Button } from '@/components/ds/Button';
import { useToast } from '@/context/ToastContext';
import useIsTeamAccount from '@/hooks/useIsTeamAccount';
import useCancelSubscription from '@/views/Subscription/hooks/useCancelSubscription';
import type { CancellationFeedback } from '@/views/Subscription/types';
import { formatBillingDate } from '../utils';
import StepHeading, { type StepProgress } from './StepHeading';
import StepLayout from './StepLayout';
import './CancelConfirmStep.css';

interface Props {
    progress: StepProgress | null;
    feedback: CancellationFeedback;
    accessEndsAt: string;
    onClose: () => void;
}

export default function CancelConfirmStep({ progress, feedback, accessEndsAt, onClose }: Props) {
    const isTeam = useIsTeamAccount();
    const { showToast } = useToast();
    const { run, isPending, errorMessage } = useCancelSubscription();
    const endDate = formatBillingDate(accessEndsAt);

    const handleConfirm = () =>
        run(feedback, {
            onSuccess: (result) => {
                showToast('success', `Renewal canceled. Access ends ${formatBillingDate(result.accessEndsAt)}.`);
                onClose();
            },
        });

    return (
        <StepLayout
            errorMessage={errorMessage}
            footer={
                <Button onClick={handleConfirm} loading={isPending}>
                    Confirm
                </Button>
            }
        >
            <StepHeading progress={progress} title='Cancel your renewal' />
            <div className='cancel-confirm__card'>
                <CalendarX size={24} className='cancel-confirm__icon' aria-hidden />
                <div>
                    <p className='cancel-confirm__title'>Access ends {endDate}</p>
                    <p className='cancel-confirm__description'>
                        Once you confirm, your subscription will not renew.{' '}
                        {isTeam ? 'Your entire team keeps' : 'You keep'} full access until {endDate}.
                    </p>
                </div>
            </div>
            <p className='cancel-confirm__keep'>
                Changed your mind?
                <button type='button' className='cancel-confirm__keep-link' onClick={onClose} disabled={isPending}>
                    Keep subscription
                </button>
            </p>
        </StepLayout>
    );
}
