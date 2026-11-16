import { type ReactNode, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { LogOut, X } from 'lucide-react';

import AuthLayout from '@/components/layouts/AuthLayout';
import { SignupProgress } from '@/components/auth/SignupProgress';
import { SkipButton } from '@/components/auth/SkipButton';
import { Button } from '@/components/ds/Button';
import { SegmentedControl } from '@/components/ds/SegmentedControl';
import { useAuth } from '@/context/AuthContext';
import { isOptimisticSignupActive, useOptimisticSignupStore } from '@/store/optimisticSignupStore';
import { hasReferralCookie } from '@/services/referralRocket';
import useHasSubscription from '@/hooks/useHasSubscription';
import { clearOfferToken, getOfferToken } from '@/utils/offerToken';
import { subscriptionPlansQuery } from '@/views/Subscription/services/getSubscriptionPlans';
import useStripeCheckout from '@/views/Subscription/hooks/useStripeCheckout';
import { BillingInterval, BillingIntervalEnum } from '@/views/Subscription/types';

import { broadcastSignupCheckoutCanceled } from './hooks/signupCheckoutSignal';
import useSignupCheckoutWaiting from './hooks/useSignupCheckoutWaiting';
import PlanCard from './components/PlanCard';
import SignupPlanSkeleton from './components/SignupPlanSkeleton';
import SpecialPricingBanner from './components/SpecialPricingBanner';
import './SignupPlan.css';

const BILLING_ITEMS: { value: BillingInterval; label: ReactNode }[] = [
    { value: BillingIntervalEnum.MONTH, label: 'Monthly' },
    {
        value: BillingIntervalEnum.YEAR,
        label: (
            <>
                Annually
                <span className="signupPlanSave">Save up to 30%</span>
            </>
        ),
    },
];

/** Sign-up step 2 (SAYSO-563): the single pricing view, rendered at /signup/plan. */
export default function SignupPlan() {
    const [pickedBillingTab, setPickedBillingTab] = useState<BillingInterval | null>(null);
    const { attributionPending, handleSignOut, globalUser } = useAuth();
    const hasSubscription = useHasSubscription();
    const navigate = useNavigate();
    // Optimistic sign-up (useOptimisticSignupStore): this view can render before the account
    // exists. Checkout, skip and sign-out all need it, so they wait for the account.
    const optimisticSignupStatus = useOptimisticSignupStore((state) => state.status);
    // Also waits for referral attribution: the server applies the referee coupon from
    // account.referral_code_used when the checkout session is created, so a checkout sent
    // before attribution lands would go out at full price.
    const isAccountReady = !!globalUser && optimisticSignupStatus !== 'pending' && !attributionPending;
    // Arrived straight from the sign-up form: play the step hand-off (view enters, progress
    // advances). Read once at mount, so a reload or a visit from the dashboard doesn't replay it.
    const [arrivedFromSignup] = useState(() =>
        isOptimisticSignupActive(useOptimisticSignupStore.getState().status),
    );

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

    // Usually already cached by the /signup prefetch, so this renders straight away and
    // refetches in the background with the new session (referral discount, admin catalog).
    const { data: subscriptionPlans, isLoading: isLoadingSubscriptionPlans } = useQuery(
        subscriptionPlansQuery(offerToken),
    );

    // Until the user picks an interval, default to yearly billing for the new-generation catalog
    // (legacy/offer users keep monthly). Set during render, not in an effect, so the toggle mounts
    // already on the default instead of animating over to it; and set once, so a later refetch
    // with a different catalog (e.g. an offer link) doesn't flip the interval under the user.
    const [defaultBillingTab, setDefaultBillingTab] = useState<BillingInterval | null>(null);
    if (defaultBillingTab === null && subscriptionPlans?.length) {
        const isNewGeneration = subscriptionPlans.some((plan) => plan.generation === 'new');
        setDefaultBillingTab(isNewGeneration ? BillingIntervalEnum.YEAR : BillingIntervalEnum.MONTH);
    }
    const selectedBillingTab = pickedBillingTab ?? defaultBillingTab ?? BillingIntervalEnum.MONTH;

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

    // A referred sign-up skeletons from the start of the optimistic hand-off: signUp only turns
    // attributionPending on after sign-in, and until then the cards would show list prices
    // (then flash to the discount) with clickable CTAs. signUp sets attributionPending before
    // it resolves, so there's no gap between the two conditions.
    const isReferredSignupPending = optimisticSignupStatus === 'pending' && hasReferralCookie();
    const showLoader = isLoadingSubscriptionPlans || attributionPending || isReferredSignupPending;

    // The toolbar is sticky on mobile; flag when it's pinned so it only gets a background then.
    // Pinned at top: 0 means it crosses the 1px-inset top edge and stops being fully visible.
    // The observer fires once, at that crossing, which can land while the toolbar is still a
    // sub-pixel above its pinned spot (top = 0.6px) and no later event follows, so compare
    // against the 1px edge, not 0.
    const toolbarRef = useRef<HTMLDivElement>(null);
    const [isToolbarStuck, setIsToolbarStuck] = useState(false);
    const showPlans = !waitingPriceId && !showLoader;
    useEffect(() => {
        const toolbar = toolbarRef.current;
        if (!showPlans || !toolbar || typeof IntersectionObserver === 'undefined') return;
        const observer = new IntersectionObserver(
            ([entry]) => setIsToolbarStuck(entry.intersectionRatio < 1 && entry.boundingClientRect.top < 1),
            { rootMargin: '-1px 0px 0px 0px', threshold: [1] },
        );
        observer.observe(toolbar);
        return () => observer.disconnect();
    }, [showPlans]);

    const hasReferralDiscount = !!globalUser?.has_referral_discount && !hasSubscription;
    const hasDiscountedOption = !!subscriptionPlans?.some((plan) =>
        plan.pricingOptions?.some((option) => option.discountInCents > 0),
    );
    const showSpecialPricing = (hasReferralDiscount && hasDiscountedOption) || !!offerToken;

    // A plan picked before the account exists is held and sent as soon as it does; its
    // button shows the usual checkout spinner meanwhile.
    const [queuedPriceId, setQueuedPriceId] = useState<string | null>(null);
    const sentQueuedPriceIdRef = useRef<string | null>(null);
    const onCheckout = (stripePriceId: string) => {
        if (isAccountReady) mutateGetStripeCheckoutPageUrl(stripePriceId);
        else setQueuedPriceId(stripePriceId);
    };
    useEffect(() => {
        if (!isAccountReady || !queuedPriceId || sentQueuedPriceIdRef.current === queuedPriceId) return;
        sentQueuedPriceIdRef.current = queuedPriceId;
        mutateGetStripeCheckoutPageUrl(queuedPriceId);
    }, [isAccountReady, queuedPriceId, mutateGetStripeCheckoutPageUrl]);
    const isCheckoutPending = isPendingGetStripeCheckoutPageUrl || (!!queuedPriceId && !isAccountReady);

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
            aside={<SignupProgress current="plan" animateFromPrevious={arrivedFromSignup} />}
            topBarProgress={<SignupProgress current="plan" variant="bar" animateFromPrevious={arrivedFromSignup} />}
            transition={arrivedFromSignup ? 'enter' : undefined}
            headerAction={isAccountReady ? signOutAction : undefined}
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
                <SignupPlanSkeleton />
            ) : (
                <div className="signupPlan">
                    <div ref={toolbarRef} className={clsx('signupPlanToolbar', isToolbarStuck && 'signupPlanToolbar--stuck')}>
                        <SegmentedControl
                            aria-label="Billing interval"
                            items={BILLING_ITEMS}
                            value={selectedBillingTab}
                            onChange={setPickedBillingTab}
                            animation="sayso-toggle-bounce-animation"
                        />
                    </div>
                    {/* Outside the toolbar so only the toggle sticks on mobile. */}
                    {showSpecialPricing && <SpecialPricingBanner />}
                    <div className="signupPlanCards">
                        {subscriptionPlans?.map((plan) =>
                            plan?.id ? (
                                <PlanCard
                                    key={plan.id}
                                    plan={plan}
                                    selectedBillingTab={selectedBillingTab}
                                    onCheckout={onCheckout}
                                    isCheckoutPending={isCheckoutPending}
                                />
                            ) : null,
                        )}
                    </div>
                    <SkipButton disabled={!isAccountReady} onClick={() => navigate('/')}>
                        Skip subscription
                    </SkipButton>
                </div>
            )}
        </AuthLayout>
    );
}
