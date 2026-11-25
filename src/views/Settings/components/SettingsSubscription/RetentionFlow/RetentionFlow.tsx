import { Button } from '@/components/ds/Button';
import useRetentionOptions from '@/views/Subscription/hooks/useRetentionOptions';
import type { ActiveSubscription } from '../utils';
import RetentionSteps from './RetentionSteps';
import StepLayout from './StepLayout';
import './RetentionFlow.css';

interface Props {
    subscription: ActiveSubscription;
    onClose: () => void;
}

export default function RetentionFlow({ subscription, onClose }: Props) {
    const { data: options, isPending, isFetching, refetch } = useRetentionOptions();

    if (isPending) {
        return (
            <StepLayout>
                <p className='retention-flow__state' role='status'>
                    <span className='subscription-card__spinner' aria-hidden />
                    Loading your options…
                </p>
            </StepLayout>
        );
    }

    if (!options) {
        return (
            <StepLayout footer={<Button onClick={() => refetch()} loading={isFetching}>Try again</Button>}>
                <p className='retention-flow__state' role='alert'>Couldn't load your options.</p>
            </StepLayout>
        );
    }

    if (!options.canCancel || !options.accessEndsAt) {
        return (
            <StepLayout footer={<Button onClick={onClose}>Close</Button>}>
                <p className='retention-flow__state' role='alert'>
                    This subscription can't be changed here right now. Please contact support.
                </p>
            </StepLayout>
        );
    }

    return (
        <RetentionSteps
            subscription={subscription}
            options={options}
            accessEndsAt={options.accessEndsAt}
            onOfferChanged={async () => (await refetch()).data?.discount}
            onClose={onClose}
        />
    );
}
