import { useState } from 'react';
import CancelSubscriptionSheet from './CancelSubscriptionSheet';
import './CancelSubscription.css';

interface Props {
    planName: string;
}

export default function CancelSubscription({ planName }: Props) {
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    return (
        <>
            <button type='button' className='cancel-subscription' onClick={() => setIsSheetOpen(true)}>
                I want to cancel
            </button>
            <CancelSubscriptionSheet open={isSheetOpen} onOpenChange={setIsSheetOpen} planName={planName} />
        </>
    );
}
