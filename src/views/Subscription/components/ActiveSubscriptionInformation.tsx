import getActivePlan from "../services/getActivePlan";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import dayjs from "dayjs";
import useStripeCancellation from "../hooks/useStripeCancellation";
import useStripeUpgrade from "../hooks/useStripeUpgrade";
import SaysoButton from "@/components/SaysoButton";
import ActiveSubscriptionInformationSkeleton from "./ActiveSubscriptionInformationSkeleton";
import ActiveSubscriptionInformationError from "./ActiveSubscriptionInformationError";
import { openExternal } from "@/utils/helpers/openExternal";
import useHasSubscription from "@/hooks/useHasSubscription";

export default function ActiveSubscriptionInformation() {
    const hasSubscription = useHasSubscription();
    const {
        mutateGetStripeCancellationPageUrl,
        isPendingGetStripeCancellationPageUrl,
    } = useStripeCancellation();

    const {
        mutateUpgradeTrialSubscription,
        isPendingUpgradeTrialSubscription,
    } = useStripeUpgrade();

    const { data: activePlan, isLoading: isLoadingActivePlan, isError: isErrorActivePlan, refetch } = useQuery({
        queryKey: ['active-plan'],
        queryFn: getActivePlan,
        enabled: hasSubscription
    });

    const {subscription, invoices} = activePlan || {};

    const isTrialing = useMemo(() => {
        return subscription?.status === 'trialing';
    }, [subscription]);

    const billingPeriod = useMemo(() => {
        return subscription?.billing?.cycle === 'month' ? 'Monthly' : 'Yearly';
    }, [subscription]);

    const renewalDate = useMemo(() => {
        const billingPeriod = subscription?.billing?.period;
        if (!billingPeriod) return '';
        return dayjs(billingPeriod.end).format('MMM D, YYYY');
    },[subscription]);

	const includedHours = useMemo(() => { 
		const planMinutes = (isTrialing ? subscription?.includedMinutes?.trial : subscription?.includedMinutes?.plan) ?? 0;
		const planHours = Math.floor(planMinutes / 60);
		return `${planHours} hours`;
	}, [subscription, isTrialing]);

    const activePlanName = useMemo(() => {
        const { name = '', status = '' } = subscription || {};
        if (status === "trialing") return `${name} - Free Trial`;
        return name;
    }, [subscription]);

    const handleCancelSubscription = () => {
        if (!subscription?.plan) return;
        mutateGetStripeCancellationPageUrl(subscription.plan);
    }

    if (isLoadingActivePlan) {
        return <ActiveSubscriptionInformationSkeleton />;
    }

    if (isErrorActivePlan) {
        return <ActiveSubscriptionInformationError onRetry={refetch} />;
    }

    const subscriptionText = subscription?.cancelledAt 
        ? `Your subscription ends on ${renewalDate}.`
        : `Your subscription will auto renew on ${renewalDate}.`;

    return (
        <div className="active-plan-information-container">
            <div className="subscription-section">
                <div className="subscription-section-content">
                    <div className="plan-header">
                        <div className="plan-details">
                            <div>
                            <h2 className="plan-name">{activePlanName}</h2>
                            <p className="plan-billing-period">{billingPeriod } - {includedHours}</p>
                            </div>

                            <div>
                                {isTrialing && (
                                    <p className="plan-renewal-text">
                                            180 free trial minutes, then 1800 minutes included.
                                    </p>
                                )}
                                <p className="plan-renewal-text">
                                    {subscriptionText}
                                </p>
                            </div>
                        </div>
                    </div>
                    {isTrialing && (
                        <button
                            className="adjust-plan-button"
                            onClick={() => mutateUpgradeTrialSubscription()}
                            disabled={isPendingUpgradeTrialSubscription}
                        >
                            {isPendingUpgradeTrialSubscription ? 'Upgrading...' : 'Upgrade to paid account'}
                        </button>
                    )}
                </div>
            </div>

            <div style={{ width: '100%', height: '1px', backgroundColor: 'var(--sayso-border)' }} />

            <div className="subscription-section">
                <h3 className="section-title">Invoices</h3>
                {invoices?.length && invoices.length > 0
                ?   <div className="invoices-table">
                        <div className="invoices-table-header">
                            <div className="invoice-col-date">Date</div>
                            <div className="invoice-col-total">Total</div>
                            <div className="invoice-col-status">Status</div>
                            <div className="invoice-col-actions">Actions</div>
                        </div>
                        {invoices?.map((invoice) => (
                            <div key={invoice.id} className="invoice-row">
                                <div className="invoice-col-date">
                                    {dayjs(invoice.created_at).format('MMM D, YYYY')}
                                </div>
                                <div className="invoice-col-total">
                                    ${((invoice.amount_paid_in_cents ?? 0) / 100).toFixed(2)}
                                </div>
                                <div className="invoice-col-status">
                                    {invoice.status && invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                                </div>
                                <div className="invoice-col-actions">
                                    <button
                                        className="view-invoice-button"
                                        onClick={() => openExternal(invoice.url ?? '')}
                                    >
                                        View
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                : <div className="invoices-table-empty">
                    <p className="invoices-table-empty-text">No invoices to display</p>
                </div>
                }
            </div>

            <div style={{ width: '100%', height: '1px', backgroundColor: 'var(--sayso-border)' }} />

            <div className="subscription-section">
                <h3 className="section-title">Stripe</h3>
                <div className="subscription-section-content">
                    <span className="cancel-plan-text">Manage your subscription</span>
                    <SaysoButton
                        label={'Open Stripe'}
                        onClick={handleCancelSubscription}
                        disabled={isPendingGetStripeCancellationPageUrl}
                        loading={isPendingGetStripeCancellationPageUrl}
                        variant="sayso-indigo"
                    />
                </div>
            </div>
        </div>
    );
}
