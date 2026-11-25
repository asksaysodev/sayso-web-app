import clsx from 'clsx';
import { Button } from '@/components/ds/Button';
import useBillingPortal from '@/views/Subscription/hooks/useBillingPortal';
import './ManageBillingButton.css';

interface Props {
    /** Secondary look, for when another action leads. */
    isTinted?: boolean;
}

export default function ManageBillingButton({ isTinted = false }: Props) {
    const { openBillingPortal, isPendingBillingPortal } = useBillingPortal();

    return (
        <Button
            className={clsx(isTinted && 'manage-billing-button--tinted')}
            onClick={openBillingPortal}
            loading={isPendingBillingPortal}
        >
            Manage billing
        </Button>
    );
}
