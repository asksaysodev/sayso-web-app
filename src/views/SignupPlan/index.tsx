import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { LogOut, X } from 'lucide-react';

import AuthLayout from '@/components/layouts/AuthLayout';
import { SignupProgress } from '@/components/auth/SignupProgress';
import { SkipButton } from '@/components/auth/SkipButton';
import { Button } from '@/components/ds/Button';
import { SegmentedControl } from '@/components/ds/SegmentedControl';
import { useAuth } from '@/context/AuthContext';
import useHasSubscription from '@/hooks/useHasSubscription';
import { clearOfferToken, getOfferToken } from '@/utils/offerToken';
import getSubscriptionPlans from '@/views/Subscription/services/getSubscriptionPlans';
import useStripeCheckout from '@/views/Subscription/hooks/useStripeCheckout';
import { BillingInterval, BillingIntervalEnum } from '@/views/Subscription/types';

import { broadcastSignupCheckoutCanceled } from './hooks/signupCheckoutSignal';
import useSignupCheckoutWaiting from './hooks/useSignupCheckoutWaiting';
import PlanCard from './components/PlanCard';
import SpecialPricingBanner from './components/SpecialPricingBanner';
import './SignupPlan.css';

const BILLING_ITEMS: { value: BillingInterval; label: string }[] = [
    { value: BillingIntervalEnum.MONTH, label: 'Monthly' },
    { value: BillingIntervalEnum.YEAR, label: 'Annually' },
];

/** Sign-up step 2 (SAYSO-563): the single pricing view, rendered at /signup/plan. */
export default function SignupPlan() {
    const [selectedBillingTab, setSelectedBillingTab] = useState<BillingInterval>(BillingIntervalEnum.MONTH);
    const { attributionPending, handleSignOut, globalUser } = useAuth();
    const hasSubscription = useHasSubscription();
    const navigate = useNavigate();

    // Give users an exit from the pricing view (they have no nav here); also the
    // natural place to drop the offer token (SAYSO-317) so it doesn't linger.
    const onSignOut = async () => {
        clearOfferToken();
        await handleSignOut();
        navigate('/login');
    };

    // URL-first (reactive) with localStorage fallback so the query key and the
    // request stay in sync, and plans re-fetch when an offer token appears (SAYSO-317).
    const [searchParams, setSearchParams] = useSearchParams();
    const offerToken = searchParams.get('offer') ?? getOfferToken();

    const { data: subscriptionPlans, isLoading: isLoadingSubscriptionPlans } = useQuery({
        queryKey: ['subscription-plans', offerToken],
        queryFn: () => getSubscriptionPlans(offerToken),
    });

    // Default to yearly billing for the new-generation catalog only (legacy/offer
    // users keep the monthly default). Runs once when plans first load.
    const didSetInitialBilling = useRef(false);
    useEffect(() => {
        if (didSetInitialBilling.current || !subscriptionPlans?.length) return;
        const isNewGeneration = subscriptionPlans.some((plan) => plan.generation === 'new');
        // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot default, guarded by didSetInitialBilling
        if (isNewGeneration) setSelectedBillingTab(BillingIntervalEnum.YEAR);
        didSetInitialBilling.current = true;
    }, [subscriptionPlans]);

    const { waitingPriceId, startWaiting, stopWaiting } = useSignupCheckoutWaiting();
    const { mutateGetStripeCheckoutPageUrl, isPendingGetStripeCheckoutPageUrl } = useStripeCheckout({
        flow: 'signup',
        onOpened: startWaiting,
    });

    // Stripe's cancel_url lands here in the checkout tab (?canceled=true): tell the waiting
    // tab to back out, show a dismissible notice, and drop the param.
    const [showCanceledNotice, setShowCanceledNotice] = useState(() => searchParams.get('canceled') === 'true');
    useEffect(() => {
        if (searchParams.get('canceled') !== 'true') return;
        broadcastSignupCheckoutCanceled();
        const next = new URLSearchParams(searchParams);
        next.delete('canceled');
        setSearchParams(next, { replace: true });
    }, [searchParams, setSearchParams]);

    const showLoader = isLoadingSubscriptionPlans || attributionPending;

    const hasReferralDiscount = !!globalUser?.has_referral_discount && !hasSubscription;
    const hasDiscountedOption = !!subscriptionPlans?.some((plan) =>
        plan.pricingOptions?.some((option) => option.discountInCents > 0),
    );
    const showSpecialPricing = (hasReferralDiscount && hasDiscountedOption) || !!offerToken;

    const signOutAction = (
        <button type="button" className="authLayoutTextLink" onClick={onSignOut}>
            <LogOut size={16} strokeWidth={1.75} aria-hidden="true" />
            Sign out
        </button>
    );

    return (
        <AuthLayout
            wide
            title="Select your plan"
            aside={<SignupProgress current="plan" />}
            headerAction={signOutAction}
        >
            {showCanceledNotice && (
                <div className="signupPlanNotice" role="status">
                    <span>Payment canceled. You can pick a plan again.</span>
                    <button
                        type="button"
                        className="signupPlanNoticeClose"
                        aria-label="Dismiss"
                        onClick={() => setShowCanceledNotice(false)}
                    >
                        <X size={16} strokeWidth={1.75} aria-hidden="true" />
                    </button>
                </div>
            )}
            {waitingPriceId ? (
                <div className="signupPlanWaiting">
                    <span className="signupPlanSpinner" aria-hidden="true" />
                    <div role="status" aria-live="polite" className="signupPlanWaitingText">
                        <h2 className="signupPlanWaitingTitle">Complete your payment in the new tab</h2>
                        <p className="signupPlanWaitingSub">
                            We'll take you to the next step automatically once your payment goes through.
                        </p>
                    </div>
                    <div className="signupPlanWaitingActions">
                        <Button
                            loading={isPendingGetStripeCheckoutPageUrl}
                            disabled={isPendingGetStripeCheckoutPageUrl}
                            onClick={() => mutateGetStripeCheckoutPageUrl(waitingPriceId)}
                        >
                            Reopen checkout
                        </Button>
                        <Button variant="ghost" onClick={stopWaiting}>
                            Choose a different plan
                        </Button>
                    </div>
                </div>
            ) : showLoader ? (
                <div className="signupPlanLoading" role="status" aria-label="Loading plans">
                    <span className="signupPlanSpinner" aria-hidden="true" />
                </div>
            ) : (
                <div className="signupPlan">
                    <div className="signupPlanToolbar">
                        <SegmentedControl
                            aria-label="Billing interval"
                            items={BILLING_ITEMS}
                            value={selectedBillingTab}
                            onChange={setSelectedBillingTab}
                        />
                        {showSpecialPricing && <SpecialPricingBanner />}
                    </div>
                    <div className="signupPlanCards">
                        {subscriptionPlans?.map((plan) =>
                            plan?.id ? (
                                <PlanCard
                                    key={plan.id}
                                    plan={plan}
                                    selectedBillingTab={selectedBillingTab}
                                    onCheckout={mutateGetStripeCheckoutPageUrl}
                                    isCheckoutPending={isPendingGetStripeCheckoutPageUrl}
                                />
                            ) : null,
                        )}
                    </div>
                    <SkipButton onClick={() => navigate('/')}>Skip subscription</SkipButton>
                </div>
            )}
        </AuthLayout>
    );
}
