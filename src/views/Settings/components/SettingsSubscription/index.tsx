import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ds/Card';
import { Button } from '@/components/ds/Button';
import useHasSubscription from '@/hooks/useHasSubscription';
import getActivePlan from '@/views/Subscription/services/getActivePlan';
import PlanCard from './PlanCard';
import InvoicesCard from './InvoicesCard';
import SubscriptionManagementCard from './SubscriptionManagementCard';
import './SettingsSubscription.css';

export default function SettingsSubscription() {
    const hasSubscription = useHasSubscription();
    const { data: activePlan, isLoading, isError, isFetching, refetch } = useQuery({
        queryKey: ['active-plan'],
        queryFn: getActivePlan,
        enabled: hasSubscription,
    });

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

    return (
        <div className='settings-subscription'>
            <PlanCard subscription={subscription} />
            <InvoicesCard invoices={invoices ?? []} />
            {!subscription.isPartnerFunded && <SubscriptionManagementCard plan={subscription.plan} />}
        </div>
    );
}
