import { useEffect, useRef, useState } from "react";
import ViewLayout from "@/components/layouts/ViewLayout";
import "./styles.css";
import BillingTabSelector from "./components/BillingTabSelector";
import PricingComponent from "./components/PricingComponent";
import { useQuery } from "@tanstack/react-query";
import getSubscriptionPlans from "./services/getSubscriptionPlans";
import ActiveSubscriptionInformation from "./components/ActiveSubscriptionInformation";
import SubscriptionPlansSkeleton from "./components/SubscriptionPlansSkeleton";
import { BillingInterval, BillingIntervalEnum } from "./types";
import useHasSubscription from "@/hooks/useHasSubscription";
import { useAuth } from "@/context/AuthContext";

export default function Subscription() {
	const [selectedBillingTab, setSelectedBillingTab] = useState<BillingInterval>(BillingIntervalEnum.MONTH);
    const hasSubscription = useHasSubscription();
    const { attributionPending } = useAuth();

	const { data: subscriptionPlans, isLoading: isLoadingSubscriptionPlans } = useQuery({
		queryKey: ['subscription-plans'],
		queryFn: getSubscriptionPlans
	})

	// Default to yearly billing for the new-generation catalog only (legacy/offer
	// users keep the monthly default). Runs once when plans first load.
	const didSetInitialBilling = useRef(false);
	useEffect(() => {
		if (didSetInitialBilling.current || !subscriptionPlans?.length) return;
		const isNewGeneration = subscriptionPlans.some((plan) => plan.generation === 'new');
		if (isNewGeneration) setSelectedBillingTab(BillingIntervalEnum.YEAR);
		didSetInitialBilling.current = true;
	}, [subscriptionPlans]);

	const showSkeleton = isLoadingSubscriptionPlans || attributionPending;

	return (
		<ViewLayout title={hasSubscription ? "Subscription" : undefined} scrollable className="subscription-view">
			{hasSubscription
				? <ActiveSubscriptionInformation />
				: showSkeleton
					? <SubscriptionPlansSkeleton />
					: <>
						<div className="select-your-plan-header">
							<h1 className="select-your-plan-title">
							    Select your plan
							</h1>
							<p className="select-your-plan-description">
			                    Once you get your subscription you will get the app to download. MacOS Ventura 13.0+ required
							</p>
						</div>
						<BillingTabSelector
							selectedBillingTab={selectedBillingTab}
							setSelectedBillingTab={setSelectedBillingTab}
						/>
						<div className="pricing-components-grid">
							{subscriptionPlans?.map((plan) => (
								plan?.id
								? (
									<PricingComponent
										key={plan.id}
										plan={plan}
										selectedBillingTab={selectedBillingTab}
									/>
								)
								: null
							))}
						</div>
					</>
			}
		</ViewLayout>
  	);
}