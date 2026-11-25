import { useState } from 'react';
import { Button } from '@/components/ds/Button';
import { Radio } from '@/components/ds/Radio';
import { TextArea } from '@/components/ds/TextArea';
import useIsTeamAccount from '@/hooks/useIsTeamAccount';
import type { CancellationFeedback, CancellationReason } from '@/views/Subscription/types';
import { formatBillingDate } from '../utils';
import Notice from './Notice';
import StepHeading, { type StepProgress } from './StepHeading';
import StepLayout from './StepLayout';
import StepLink from './StepLink';
import './ReasonStep.css';

const MAX_DETAILS_LENGTH = 1000;

interface Props {
    progress: StepProgress | null;
    reasons: CancellationReason[];
    accessEndsAt: string;
    onContinue: (feedback: CancellationFeedback) => void;
}

export default function ReasonStep({ progress, reasons, accessEndsAt, onContinue }: Props) {
    const isTeam = useIsTeamAccount();
    const [reasonKey, setReasonKey] = useState<string>();
    const [details, setDetails] = useState('');
    const [isReasonMissing, setIsReasonMissing] = useState(false);

    const handleContinue = () => {
        const reasonDetails = details.trim();
        if (reasonDetails && !reasonKey) {
            setIsReasonMissing(true);
            return;
        }
        onContinue(reasonKey ? { reasonKey, ...(reasonDetails ? { reasonDetails } : {}) } : {});
    };

    return (
        <StepLayout
            isCompact
            errorMessage={isReasonMissing ? 'Choose a reason to send your comment.' : null}
            footer={
                <>
                    <StepLink onClick={() => onContinue({})}>Skip this step</StepLink>
                    <Button onClick={handleContinue}>Continue</Button>
                </>
            }
        >
            <StepHeading
                progress={progress}
                title='Why are you leaving?'
                description='Your feedback is optional and helps us improve Sayso.'
            />
            <div className='reason-step__reasons' role='radiogroup' aria-label='Why are you leaving?'>
                {reasons.map(({ key, label }) => (
                    <Radio
                        key={key}
                        className='reason-step__reason'
                        name='cancellation-reason'
                        label={label}
                        checked={reasonKey === key}
                        onChange={() => {
                            setReasonKey(key);
                            setIsReasonMissing(false);
                        }}
                    />
                ))}
            </div>
            <hr className='reason-step__divider' />
            <TextArea
                label='Anything else?'
                value={details}
                maxLength={MAX_DETAILS_LENGTH}
                onChange={(event) => setDetails(event.target.value)}
            />
            <Notice tone='primary' className='reason-step__access'>
                {isTeam ? 'You and your team keep' : 'You keep'} full access until{' '}
                <strong>{formatBillingDate(accessEndsAt, 'MMMM D, YYYY')}.</strong>
            </Notice>
        </StepLayout>
    );
}
