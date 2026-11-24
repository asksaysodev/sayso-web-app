import { useState } from 'react';
import { Button } from '@/components/ds/Button';
import StepLink from '../RetentionFlow/StepLink';
import { billAfterRemovingPause, formatBill } from '../planState';
import { type ActiveSubscription, formatBillingDate } from '../utils';
import ActionNotice from './ActionNotice';
import StateActionLayout from './StateActionLayout';
import type { Resume } from './useResume';

interface Props {
    subscription: ActiveSubscription;
    resume: Resume;
    onClose: () => void;
}

export default function RemovePauseConfirm({ subscription, resume, onClose }: Props) {
    const [today] = useState(() => formatBillingDate(new Date().toISOString()));
    const { confirm, isPending, errorCode, errorMessage } = resume;
    const bill = billAfterRemovingPause(subscription);
    const confirmLabel = errorMessage && errorCode !== 'resume_changed' ? 'Try again' : 'Remove scheduled pause';

    return (
        <StateActionLayout
            title='Keep your subscription active?'
            description='Remove your scheduled pause and keep full access. Your current billing cycle stays the same.'
            rows={[
                { label: 'Charged today', value: `$0 · ${today}` },
                ...(bill ? [{ label: 'Next renewal', value: formatBill(bill) }] : []),
            ]}
            footer={
                <>
                    <StepLink onClick={onClose} disabled={isPending}>
                        Keep scheduled pause
                    </StepLink>
                    <Button onClick={confirm} loading={isPending}>
                        {isPending ? 'Removing pause…' : confirmLabel}
                    </Button>
                </>
            }
        >
            <ActionNotice
                errorMessage={errorMessage}
                isPending={isPending}
                pendingMessage='Confirming the pause was removed. Please wait before trying again.'
                message='No new billing cycle starts today. Your hours keep their current refill date.'
            />
        </StateActionLayout>
    );
}
