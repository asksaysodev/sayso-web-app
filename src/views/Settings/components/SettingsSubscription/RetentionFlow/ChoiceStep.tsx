import { CalendarX, Pause } from 'lucide-react';
import { Button } from '@/components/ds/Button';
import useIsTeamAccount from '@/hooks/useIsTeamAccount';
import type { PauseOption } from '@/views/Subscription/types';
import { formatBillingDate, formatMonths, joinList } from '../utils';
import OptionCard from './OptionCard';
import StepHeading, { type StepProgress } from './StepHeading';
import StepLayout from './StepLayout';
import StepLink from './StepLink';
import type { RetentionChoice } from './retentionPaths';

interface Props {
    progress: StepProgress | null;
    pauseOptions: PauseOption[];
    accessEndsAt: string;
    choice: RetentionChoice | null;
    onChoiceChange: (choice: RetentionChoice) => void;
    onContinue: () => void;
    onClose: () => void;
}

const formatDurations = (options: PauseOption[]) => {
    const months = options.map((option) => option.months);
    const last = months[months.length - 1];
    return months.length === 1 ? formatMonths(last) : `${joinList(months, 'or')} months`;
};

export default function ChoiceStep({
    progress,
    pauseOptions,
    accessEndsAt,
    choice,
    onChoiceChange,
    onContinue,
    onClose,
}: Props) {
    const isTeam = useIsTeamAccount();

    return (
        <StepLayout
            footer={
                <>
                    <StepLink onClick={onClose}>I regretted it</StepLink>
                    <Button onClick={onContinue} disabled={!choice}>
                        Confirm selection
                    </Button>
                </>
            }
        >
            <StepHeading
                progress={progress}
                title='What would you like to do?'
                description='Take a break from Sayso or cancel your next renewal.'
            />
            <OptionCard
                name='retention-choice'
                checked={choice === 'pause'}
                onChange={() => onChoiceChange('pause')}
                icon={<Pause size={24} />}
                title='Pause subscription'
                description={`Pause access and billing for ${formatDurations(pauseOptions)}. Resume whenever you’re ready.`}
            />
            <OptionCard
                name='retention-choice'
                checked={choice === 'cancel'}
                onChange={() => onChoiceChange('cancel')}
                icon={<CalendarX size={24} />}
                title='Cancel subscription'
                description={`End your renewal. ${isTeam ? 'Your team keeps' : 'You keep'} access until ${formatBillingDate(accessEndsAt)}.`}
            />
        </StepLayout>
    );
}
