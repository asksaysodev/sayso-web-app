import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ds/Card';
import { Button } from '@/components/ds/Button';
import useHasSubscription from '@/hooks/useHasSubscription';
import getActivePlan from '@/views/Subscription/services/getActivePlan';
import PlanCard from './PlanCard';
import InvoicesCard from './InvoicesCard';
import PlanDiscountCard from './PlanDiscountCard';
import PlanStateCard from './PlanStateCard';
import SubscriptionSheet, { type SubscriptionFlow } from './SubscriptionSheet';
import { hasDiscountCard, type PlanState, planStateOf } from './planState';
import type { ActiveSubscription } from './utils';
import SubscriptionManagementCard from './SubscriptionManagementCard';
import './SettingsSubscription.css';

export default function SettingsSubscription() {
    const hasSubscription = useHasSubscription();
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [flow, setFlow] = useState<SubscriptionFlow>('cancel');
    // Remounts the sheet on every open: its exit animation keeps the previous flow alive for a moment.
    const [sheetSession, setSheetSession] = useState(0);
    const { data: activePlan, isLoading, isError, isFetching, refetch } = useQuery({
        queryKey: ['active-plan'],
        queryFn: getActivePlan,
        enabled: hasSubscription,
    });

    const openSheet = (nextFlow: SubscriptionFlow) => {
        setFlow(nextFlow);
        setSheetSession((session) => session + 1);
        setIsSheetOpen(true);
    };

    const renderPlan = (subscription: ActiveSubscription, state: PlanState) => {
        if (state !== 'normal') {
            return <PlanStateCard subscription={subscription} state={state} onResume={() => openSheet('resume')} />;
        }
        if (hasDiscountCard(subscription)) return <PlanDiscountCard subscription={subscription} />;
        return <PlanCard subscription={subscription} />;
    };

    const renderCards = () => {
        if (isLoading) {
            return (
                <div className='settings-subscription'>
                    <Card className='subscription-card subscription-card--state' role='status'>
                        <span className='subscription-card__spinner' aria-hidden />
                        Loading your subscription…
                    </Card>
                </div>
            );
        }

        if (isError || !activePlan?.subscription) {
            return (
                <div className='settings-subscription'>
                    <Card className='subscription-card subscription-card--state' role='alert'>
                        {hasSubscription ? "Couldn't load your billing data." : "You don't have an active subscription."}
                        {hasSubscription && (
                            <Button variant='secondary' size='sm' onClick={() => refetch()} loading={isFetching}>
                                Try again
                            </Button>
                        )}
                    </Card>
                </div>
            );
        }

        const { subscription, invoices } = activePlan;
        const state = planStateOf(subscription);
        const invoicesCard = <InvoicesCard invoices={invoices ?? []} />;

        return (
            <div className='settings-subscription'>
                {renderPlan(subscription, state)}
                {state === 'normal' && invoicesCard}
                {!subscription.isPartnerFunded && (
                    <SubscriptionManagementCard
                        subscription={subscription}
                        state={state}
                        onCancel={() => openSheet('cancel')}
                        onReactivate={() => openSheet('reactivate')}
                    />
                )}
                {state !== 'normal' && invoicesCard}
            </div>
        );
    };

    return (
        <>
            {renderCards()}
            {activePlan?.subscription && (
                <SubscriptionSheet
                    key={sheetSession}
                    flow={flow}
                    open={isSheetOpen}
                    onOpenChange={setIsSheetOpen}
                    subscription={activePlan.subscription}
                />
            )}
        </>
    );
}
