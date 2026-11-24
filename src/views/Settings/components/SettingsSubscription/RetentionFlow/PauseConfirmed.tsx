import { Button } from '@/components/ds/Button';
import useIsTeamAccount from '@/hooks/useIsTeamAccount';
import type { PauseSubscriptionResponse } from '@/views/Subscription/types';
import { formatBillingDate, formatDollars, formatMonths } from '../utils';
import Notice from './Notice';
import StepHeading from './StepHeading';
import StepLayout from './StepLayout';
import SummaryRows from './SummaryRows';

interface Props {
    months: number;
    result: PauseSubscriptionResponse;
    onClose: () => void;
}

export default function PauseConfirmed({ months, result, onClose }: Props) {
    const isTeam = useIsTeamAccount();
    const startDate = formatBillingDate(result.pauseStartsAt);

    return (
        <StepLayout footer={<Button onClick={onClose}>Continue</Button>}>
            <StepHeading
                isSuccess
                title={`Access ends ${startDate}`}
                description={`${isTeam ? 'Your team keeps' : 'You keep'} full access until that date. Access and billing then pause for ${formatMonths(months)}.`}
            />
            <SummaryRows
                rows={[
                    { label: 'Pause begins', value: startDate },
                    { label: 'Resumes automatically', value: formatBillingDate(result.resumesAt) },
                    { label: 'Monthly price on return', value: formatDollars(result.priceOnReturn) },
                ]}
            />
            <Notice tone='warning'>You can change your mind and reactivate from Subscription.</Notice>
        </StepLayout>
    );
}
