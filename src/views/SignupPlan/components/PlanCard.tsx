import { useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { Armchair, ChevronRight, CircleUser, Clock, Gift, Users } from 'lucide-react';

import { Button } from '@/components/ds/Button';
import { Modal, ModalBody, ModalHeader } from '@/components/ds/Modal';
import { useAuth } from '@/context/AuthContext';
import useHasSubscription from '@/hooks/useHasSubscription';
import useStripeCheckout from '@/views/Subscription/hooks/useStripeCheckout';
import { BillingInterval, BillingIntervalEnum, PricingOption, PricingPlan } from '@/views/Subscription/types';
import formatMinutesToHours from '@/utils/formatters/formatMinutesToHours';
import centsToDollars from '@/utils/formatters/centsToDollars';
import formatPrice from '@/utils/formatters/formatPrice';
import { openExternal } from '@/utils/helpers/openExternal';

import { PackageOverlay, PackageTrigger } from './PackagePicker';
import PlanFeatures from './PlanFeatures';

interface Props {
    plan: PricingPlan;
    selectedBillingTab: BillingInterval;
}

export default function PlanCard({ plan, selectedBillingTab = BillingIntervalEnum.MONTH }: Props) {
    const {
        name: planName,
        features,
        pricingOptions,
        purchasable,
        contactLink,
        includedMinutes,
        trialDays = null,
        trialIncludedMinutes = null,
        hasTrial = false,
        hasPackages,
        generation = null,
        accountType = null,
    } = plan;

    const [packageSelected, setPackageSelected] = useState<null | PricingOption>(null);
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const restoreTriggerFocus = useRef(false);

    // Changing the billing interval invalidates the package picked for the other interval.
    useEffect(() => {
        const resetPackages = () => {
            setPackageSelected(null);
            setIsPickerOpen(false);
        };
        resetPackages();
    }, [selectedBillingTab]);

    // Return focus to the trigger after the overlay closes (the card content is inert while it is open).
    useEffect(() => {
        if (!isPickerOpen && restoreTriggerFocus.current) {
            restoreTriggerFocus.current = false;
            triggerRef.current?.focus();
        }
    }, [isPickerOpen]);

    const hasSubscription = useHasSubscription();
    const { globalUser } = useAuth();
    const hasReferralDiscount = !!globalUser?.has_referral_discount && !hasSubscription;
    const { isPendingGetStripeCheckoutPageUrl, mutateGetStripeCheckoutPageUrl } = useStripeCheckout();

    const availablePackages = useMemo(
        () => (pricingOptions ? pricingOptions.filter((opt) => opt.interval === selectedBillingTab) : []),
        [pricingOptions, selectedBillingTab],
    );

    const pricingOptionSelected = useMemo(
        () => (pricingOptions ? pricingOptions.find((opt) => opt.interval === selectedBillingTab) ?? null : null),
        [pricingOptions, selectedBillingTab],
    );

    const allFeatures = useMemo(() => features?.features ?? [], [features]);

    // New-generation team plans inherit the Individual + catalog.
    const isNewTeamPlan = generation === 'new' && accountType === 'team';

    const effectivePricingOption = hasPackages ? packageSelected : pricingOptionSelected;

    const priceInDollars = effectivePricingOption ? centsToDollars(effectivePricingOption.priceInCents) : 0;

    const startingPriceInDollars = useMemo(() => {
        if (!hasPackages || !availablePackages.length) return null;
        return centsToDollars(Math.min(...availablePackages.map((opt) => opt.priceInCents)));
    }, [hasPackages, availablePackages]);

    // Discount comes from the server (Stripe coupon amount_off), never hardcoded
    const discountDollars = useMemo(() => {
        if (!hasReferralDiscount) return 0;
        const option = effectivePricingOption ?? pricingOptionSelected ?? availablePackages[0];
        return (option?.discountInCents ?? 0) / 100;
    }, [hasReferralDiscount, effectivePricingOption, pricingOptionSelected, availablePackages]);

    const baseDisplayPrice = hasPackages && !packageSelected ? (startingPriceInDollars ?? 0) : priceInDollars;
    const finalDisplayPrice = discountDollars > 0 ? Math.max(0, baseDisplayPrice - discountDollars) : baseDisplayPrice;

    const needsPackage = purchasable && hasPackages;
    const showFrom = needsPackage && !packageSelected;
    const isYearly = selectedBillingTab === BillingIntervalEnum.YEAR;
    const period = isYearly ? 'year' : 'month';

    const includedMinutesPerMonth = effectivePricingOption?.includedMinutesPerMonth ?? includedMinutes ?? 0;
    const showTrialBadge = hasTrial && !!trialDays && trialIncludedMinutes != null;
    const Icon = accountType === 'team' ? Users : CircleUser;

    const closePicker = () => {
        restoreTriggerFocus.current = true;
        setIsPickerOpen(false);
    };

    const confirmPackage = (pricingPackage: PricingOption) => {
        if (packageSelected && pricingPackage.stripePriceId === packageSelected?.stripePriceId) {
            closePicker();
            return;
        }
        setPackageSelected(pricingPackage);
        closePicker();
    };

    const handleCta = () => {
        if (hasPackages && !packageSelected) {
            setIsPickerOpen(true);
            return;
        }
        if (purchasable && effectivePricingOption) {
            mutateGetStripeCheckoutPageUrl(effectivePricingOption.stripePriceId);
            return;
        }
        if (contactLink) openExternal(contactLink);
    };

    const ctaDisabled = isPendingGetStripeCheckoutPageUrl || hasSubscription || (needsPackage && !packageSelected);
    const hintId = `signup-plan-hint-${plan.id}`;

    return (
        <article className={clsx('signupPlanCard', showTrialBadge && 'signupPlanCard--hasBadge')}>
            {showTrialBadge && (
                <div className="signupPlanBadge">
                    <span>{formatMinutesToHours(trialIncludedMinutes ?? 0)} FREE HOURS FOR {trialDays} DAYS</span>
                    <Gift size={16} strokeWidth={1.75} aria-hidden="true" />
                </div>
            )}

            <div className="signupPlanCardContent" inert={isPickerOpen}>
            <header className="signupPlanCardHeading">
                <Icon size={32} strokeWidth={1.5} aria-hidden="true" className="signupPlanCardIcon" />
                <h2 className="signupPlanCardName">{planName}</h2>
            </header>

            <div className="signupPlanCardBody">
                <div className="signupPlanPriceBlock">
                    {purchasable ? (
                        <>
                            <div className="signupPlanPriceRow">
                                {showFrom && <span className="signupPlanPriceFrom">from</span>}
                                <span className="signupPlanPriceAmount">${formatPrice(finalDisplayPrice)}</span>
                                <span className="signupPlanPricePeriod">/{period}</span>
                                {discountDollars > 0 && (
                                    <span className="signupPlanPriceStrike" aria-label={`was $${formatPrice(baseDisplayPrice)}`}>
                                        ${formatPrice(baseDisplayPrice)}
                                    </span>
                                )}
                            </div>
                            <p className="signupPlanPriceSub">
                                {showFrom
                                    ? `Plans start at $${formatPrice(finalDisplayPrice)} / ${period}`
                                    : isYearly ? 'Billed annually' : 'Billed monthly'}
                            </p>
                        </>
                    ) : (
                        <>
                            <div className="signupPlanPriceRow">
                                <span className="signupPlanPriceAmount">Let's talk</span>
                            </div>
                            <p className="signupPlanPriceSub">Pricing tailored to your team</p>
                        </>
                    )}
                </div>

                {!purchasable ? (
                    <div className="signupPlanChip">
                        <Armchair size={24} strokeWidth={1.5} aria-hidden="true" />
                        <span>Custom seats and coaching hours</span>
                    </div>
                ) : needsPackage ? (
                    <PackageTrigger
                        ref={triggerRef}
                        selected={packageSelected}
                        selectedPrice={finalDisplayPrice}
                        open={isPickerOpen}
                        onOpen={() => setIsPickerOpen(true)}
                    />
                ) : (
                    <div className="signupPlanChip">
                        <Clock size={24} strokeWidth={1.5} aria-hidden="true" />
                        <span>{formatMinutesToHours(includedMinutesPerMonth)} coaching hours per month</span>
                    </div>
                )}

                <div className="signupPlanCtaGroup">
                    <Button
                        className={clsx('signupPlanCta', !purchasable && 'signupPlanCta--contact')}
                        loading={isPendingGetStripeCheckoutPageUrl}
                        disabled={ctaDisabled}
                        aria-describedby={needsPackage && !packageSelected ? hintId : undefined}
                        onClick={handleCta}
                    >
                        {purchasable ? `Choose ${planName}` : 'Contact sales'}
                    </Button>
                    {needsPackage && (
                        // Always mounted so the card keeps its height once a package is picked;
                        // hidden (and aria-hidden) after selection instead of removed.
                        <p
                            id={hintId}
                            className={`signupPlanCtaHint${packageSelected ? ' signupPlanCtaHint--hidden' : ''}`}
                            aria-hidden={packageSelected ? true : undefined}
                        >
                            Select a package to continue
                        </p>
                    )}
                </div>
            </div>

            <div className="signupPlanIncluded">
                <button
                    type="button"
                    className="signupPlanIncludedToggle"
                    aria-haspopup="dialog"
                    onClick={() => setIsFeaturesOpen(true)}
                >
                    <span>See what's included</span>
                    <ChevronRight size={16} strokeWidth={1.75} aria-hidden="true" />
                </button>
            </div>
            </div>

            {isPickerOpen && needsPackage && (
                <PackageOverlay
                    packages={availablePackages}
                    selected={packageSelected}
                    discountDollars={discountDollars}
                    hasReferralDiscount={hasReferralDiscount}
                    onSelect={confirmPackage}
                    onClose={closePicker}
                />
            )}

            <Modal open={isFeaturesOpen} onOpenChange={setIsFeaturesOpen} aria-describedby={undefined}>
                <ModalHeader align="start" title={`${planName}: what's included`} />
                <ModalBody>
                    <PlanFeatures features={allFeatures} inheritsIndividual={isNewTeamPlan} />
                </ModalBody>
            </Modal>
        </article>
    );
}
