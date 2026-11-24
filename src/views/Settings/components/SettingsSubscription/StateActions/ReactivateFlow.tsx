import { useState } from 'react';
import { Button } from '@/components/ds/Button';
import useReactivateSubscription from '@/views/Subscription/hooks/useReactivateSubscription';
import Notice from '../RetentionFlow/Notice';
import StepLink from '../RetentionFlow/StepLink';
import { billAfterReactivation, formatBill, formatBillSentence } from '../planState';
import { type ActiveSubscription, formatBillingDate } from '../utils';
import ActionNotice from './ActionNotice';
import StateActionLayout from './StateActionLayout';

interface Props {
    subscription: ActiveSubscription;
    onClose: () => void;
}

export default function ReactivateFlow({ subscription, onClose }: Props) {
    // The plan refetches behind the sheet; what the user confirmed must not change with it.
    const [bill] = useState(() => billAfterReactivation(subscription));
    const [isPauseKept] = useState(subscription.pause.state !== 'none');
    const [isDone, setIsDone] = useState(false);
    const [today] = useState(() => formatBillingDate(new Date().toISOString()));
    const { run, isPending, errorMessage } = useReactivateSubscription();

    const rows = [
        { label: 'Charged today', value: `$0 · ${today}` },
        ...(bill ? [{ label: 'Next bill', value: formatBill(bill) }] : []),
    ];

    if (isDone) {
        return (
            <StateActionLayout
                title='Subscription reactivated'
                description={[
                    isPauseKept
                        ? 'Your renewal is back on. Your pause stays in place.'
                        : 'Your subscription stays active at the same price.',
                    bill && `Your next bill is ${formatBillSentence(bill)}.`,
                ].filter(Boolean).join(' ')}
                rows={rows}
                footer={<Button onClick={onClose}>Back to subscription</Button>}
            >
                <Notice tone='success' role='status'>No charge today. Your plan and price are unchanged.</Notice>
            </StateActionLayout>
        );
    }

    const confirmLabel = errorMessage ? 'Try again' : 'Reactivate subscription';

    return (
        <StateActionLayout
            title='Reactivate your subscription?'
            description={
                isPauseKept
                    ? 'Keep your current plan and price. Your pause stays in place and billing restarts when it ends.'
                    : 'Keep your current plan and price. Your subscription will renew on its original date.'
            }
            rows={rows}
            footer={
                <>
                    <StepLink onClick={onClose} disabled={isPending}>
                        Keep cancellation
                    </StepLink>
                    <Button onClick={() => run(undefined, { onSuccess: () => setIsDone(true) })} loading={isPending}>
                        {isPending ? 'Reactivating…' : confirmLabel}
                    </Button>
                </>
            }
        >
            <ActionNotice
                errorMessage={errorMessage}
                isPending={isPending}
                pendingMessage='Confirming reactivation. Please wait before trying again.'
                message={isPauseKept ? 'No charge today.' : 'Your access continues without interruption.'}
            />
        </StateActionLayout>
    );
}
