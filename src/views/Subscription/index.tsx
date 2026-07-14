import { useEffect, useRef, useState } from "react";
import ViewLayout from "@/components/layouts/ViewLayout";
import "./styles.css";
import BillingTabSelector from "./components/BillingTabSelector";
import PricingComponent from "./components/PricingComponent";
import { useQuery } from "@tanstack/react-query";
import getSubscriptionPlans from "./services/getSubscriptionPlans";
import ActiveSubscriptionInformation from "./components/ActiveSubscriptionInformation";
import SaysoLoader from "@/components/SaysoLoader";
import { BillingInterval, BillingIntervalEnum } from "./types";
import useHasSubscription from "@/hooks/useHasSubscription";
import { useAuth } from "@/context/AuthContext";
import OfferBanner from "@/components/OfferBanner";
import { useNavigate } from "react-router-dom";
import { LuLogOut } from "react-icons/lu";
import { clearOfferToken } from "@/utils/offerToken";

export default function Subscription() {
	const [selectedBillingTab, setSelectedBillingTab] = useState<BillingInterval>(BillingIntervalEnum.MONTH);
    const hasSubscription = useHasSubscription();
    const { attributionPending, handleSignOut } = useAuth();
    const navigate = useNavigate();

    // Give users an exit from the pricing view (they have no nav here); also the
    // natural place to drop the offer token (SAYSO-317) so it doesn't linger.
    const onSignOut = async () => {
        clearOfferToken();
        await handleSignOut();
        navigate('/login');
    };

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

	const showLoader = isLoadingSubscriptionPlans || attributionPending;

	return (
		<ViewLayout title={hasSubscription ? "Subscription" : undefined} scrollable className="subscription-view">
			{hasSubscription
				? <ActiveSubscriptionInformation />
				: showLoader
					? <SaysoLoader />
					: <>
						<div className="subscription-topbar">
							<button type="button" className="subscription-signout" onClick={onSignOut}>
								<LuLogOut size={16} />
								Sign out
							</button>
						</div>
						<OfferBanner />
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