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

export default function Subscription() {
	const [selectedBillingTab, setSelectedBillingTab] = useState<BillingInterval>(BillingIntervalEnum.MONTH);
    const hasSubscription = useHasSubscription();

	const { data: subscriptionPlans } = useQuery({
		queryKey: ['subscription-plans'],
		queryFn: getSubscriptionPlans
	})

	return (
		<ViewLayout title="Subscription" scrollable>
			{hasSubscription
				? <ActiveSubscriptionInformation />
				: <>
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