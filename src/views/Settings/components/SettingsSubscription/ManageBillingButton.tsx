import { Button } from '@/components/ds/Button';
import useBillingPortal from '@/views/Subscription/hooks/useBillingPortal';

export default function ManageBillingButton() {
    const { openBillingPortal, isPendingBillingPortal } = useBillingPortal();

    return (
        <Button variant='secondary' onClick={openBillingPortal} loading={isPendingBillingPortal}>
            Manage billing
        </Button>
    );
}
