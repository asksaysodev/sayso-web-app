import { useState } from 'react';
import { Button } from '@/components/ds/Button';
import { SelectField } from '@/components/ds/SelectField';
import usePauseSubscription from '@/views/Subscription/hooks/usePauseSubscription';
import type { PauseOption, PauseSubscriptionResponse } from '@/views/Subscription/types';
import { formatBillingDate, formatMonths, formatPriceWithInterval } from '../utils';
import Notice from './Notice';
import StepHeading, { type StepProgress } from './StepHeading';
import StepLayout from './StepLayout';
import StepLink from './StepLink';
import SummaryRows from './SummaryRows';

interface Props {
    progress: StepProgress | null;
    options: PauseOption[];
    interval: string | null;
    onPaused: (option: PauseOption, result: PauseSubscriptionResponse) => void;
    onClose: () => void;
}

export default function PauseDurationStep({ progress, options, interval, onPaused, onClose }: Props) {
    const [months, setMonths] = useState(options[0].months);
    const { run, isPending, hasUnconfirmedAttempt, errorMessage } = usePauseSubscription();
    const option = options.find((candidate) => candidate.months === months) ?? options[0];

    const handleConfirm = () => run(option, { onSuccess: (result) => onPaused(option, result) });

    return (
        <StepLayout
            errorMessage={errorMessage}
            footer={
                <>
                    <StepLink onClick={onClose} disabled={isPending}>
                        I regretted it
                    </StepLink>
                    <Button onClick={handleConfirm} loading={isPending}>
                        Confirm pause
                    </Button>
                </>
            }
        >
            <StepHeading
                progress={progress}
                title='How long do you need?'
                description='Your pause starts after your current paid period ends.'
            />
            <SelectField
                label='Pause duration'
                options={options.map((candidate) => ({
                    value: String(candidate.months),
                    label: formatMonths(candidate.months),
                }))}
                value={String(option.months)}
                onChange={(value) => setMonths(Number(value))}
                disabled={isPending || hasUnconfirmedAttempt}
            />
            <SummaryRows
                rows={[
                    { label: 'Access ends', value: formatBillingDate(option.startsAt) },
                    { label: 'Access & billing resume', value: formatBillingDate(option.resumesAt) },
                    { label: 'Price when resumed', value: formatPriceWithInterval(option.priceOnReturn, interval) },
                ]}
            />
            <Notice tone='primary'>No charges during the pause. You can resume earlier from Subscription.</Notice>
        </StepLayout>
    );
}
