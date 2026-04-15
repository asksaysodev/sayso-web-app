import { useState } from "react";
import ViewLayout from "@/components/layouts/ViewLayout";
import "./styles.css";
import BillingTabSelector from "./components/BillingTabSelector";
import PricingComponent from "./components/PricingComponent";
import { useQuery } from "@tanstack/react-query";
import getSubscriptionPlans from "./services/getSubscriptionPlans";
import ActiveSubscriptionInformation from "./components/ActiveSubscriptionInformation";
import { BillingInterval, BillingIntervalEnum } from "./types";
import useHasSubscription from "@/hooks/useHasSubscription";
import SaysoLoader from "@/components/SaysoLoader";

export default function Subscription() {
	const [selectedBillingTab, setSelectedBillingTab] = useState<BillingInterval>(BillingIntervalEnum.MONTH);
    const hasSubscription = useHasSubscription();

	const { data: subscriptionPlans, isLoading: isLoadingSubscriptionPlans } = useQuery({
		queryKey: ['subscription-plans'],
		queryFn: getSubscriptionPlans
	})
	
	return (
		<ViewLayout title={hasSubscription ? "Subscription" : undefined} scrollable>
			{hasSubscription
				? <ActiveSubscriptionInformation />
				: isLoadingSubscriptionPlans
					? <div className="subscription-plans-loader"><SaysoLoader /></div>
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