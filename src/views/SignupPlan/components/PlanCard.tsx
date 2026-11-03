import { useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { Armchair, ChevronRight, CircleUser, Clock, Gift, Users } from 'lucide-react';

import { Button } from '@/components/ds/Button';
import { Modal, ModalBody, ModalHeader } from '@/components/ds/Modal';
import { useAuth } from '@/context/AuthContext';
import useHasSubscription from '@/hooks/useHasSubscription';
import { BillingInterval, BillingIntervalEnum, PricingOption, PricingPlan } from '@/views/Subscription/types';
import formatMinutesToHours from '@/utils/formatters/formatMinutesToHours';
import centsToDollars from '@/utils/formatters/centsToDollars';
import formatPrice from '@/utils/formatters/formatPrice';
import { openExternal } from '@/utils/helpers/openExternal';

import PackageOverlay from './PackageOverlay';
import PackageTrigger from './PackageTrigger';
import PlanFeatures from './PlanFeatures';

interface Props {
    plan: PricingPlan;
    selectedBillingTab: BillingInterval;
    /** Starts the sign-up checkout for a Stripe price (owned by the page, which shows the waiting state). */
    onCheckout: (stripePriceId: string) => void;
    isCheckoutPending: boolean;
}

export default function PlanCard({ plan, selectedBillingTab = BillingIntervalEnum.MONTH, onCheckout, isCheckoutPending }: Props) {
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
    const pickerOpener = useRef<HTMLElement | null>(null);

    // Changing the billing interval invalidates the package picked for the other interval.
    useEffect(() => {
        const resetPackages = () => {
            setPackageSelected(null);
            setIsPickerOpen(false);
        };
        resetPackages();
    }, [selectedBillingTab]);

    // Return focus to whatever opened the overlay (the card content is inert while it is open).
    useEffect(() => {
        if (!isPickerOpen && restoreTriggerFocus.current) {
            restoreTriggerFocus.current = false;
            (pickerOpener.current ?? triggerRef.current)?.focus();
            pickerOpener.current = null;
        }
    }, [isPickerOpen]);

    const hasSubscription = useHasSubscription();
    const { globalUser } = useAuth();
    const hasReferralDiscount = !!globalUser?.has_referral_discount && !hasSubscription;

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
    const showPerMonth = isYearly && !hasPackages;
    const period = isYearly && !showPerMonth ? 'year' : 'month';
    const formatDisplay = (amount: number) =>
        showPerMonth ? formatPrice(amount / 12, { keepCents: true }) : formatPrice(amount);

    const includedMinutesPerMonth = effectivePricingOption?.includedMinutesPerMonth ?? includedMinutes ?? 0;
    const showTrialBadge = hasTrial && !!trialDays && trialIncludedMinutes != null;
    const Icon = accountType === 'team' ? Users : CircleUser;

    const openPicker = () => {
        pickerOpener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        setIsPickerOpen(true);
    };

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
        if (needsPackage && !packageSelected) {
            openPicker();
            return;
        }
        if (purchasable && effectivePricingOption) {
            onCheckout(effectivePricingOption.stripePriceId);
            return;
        }
        if (contactLink) openExternal(contactLink);
    };

    const ctaDisabled = isCheckoutPending || hasSubscription;
    const ctaLabel = !purchasable ? 'Contact sales' : showFrom ? 'Select plan' : `Choose ${planName}`;

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
                                <span className="signupPlanPriceAmount">${formatDisplay(finalDisplayPrice)}</span>
                                <span className="signupPlanPricePeriod">/{period}</span>
                                {discountDollars > 0 && (
                                    <span className="signupPlanPriceStrike" aria-label={`was $${formatDisplay(baseDisplayPrice)}`}>
                                        ${formatDisplay(baseDisplayPrice)}
                                    </span>
                                )}
                            </div>
                            <p className="signupPlanPriceSub">
                                {showFrom
                                    ? `Plans start at $${formatPrice(finalDisplayPrice)} / ${period}`
                                    : showPerMonth
                                        ? `Billed annually at $${formatPrice(finalDisplayPrice)}`
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
                        onOpen={openPicker}
                    />
                ) : (
                    <div className="signupPlanChip">
                        <Clock size={24} strokeWidth={1.5} aria-hidden="true" />
                        <span>{formatMinutesToHours(includedMinutesPerMonth)} conversation hours per month</span>
                    </div>
                )}

                <Button
                    className={clsx('signupPlanCta', !purchasable && 'signupPlanCta--contact')}
                    loading={isCheckoutPending}
                    disabled={ctaDisabled}
                    onClick={handleCta}
                >
                    {ctaLabel}
                </Button>
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

            {needsPackage && (
                <PackageOverlay
                    open={isPickerOpen}
                    packages={availablePackages}
                    selected={packageSelected}
                    discountDollars={discountDollars}
                    hasReferralDiscount={hasReferralDiscount}
                    onSelect={confirmPackage}
                    onClose={closePicker}
                />
            )}

            <Modal
                className="signupPlanFeaturesModal"
                open={isFeaturesOpen}
                onOpenChange={setIsFeaturesOpen}
                aria-describedby={undefined}
            >
                <ModalHeader
                    align="start"
                    icon={<Icon size={24} strokeWidth={1.75} />}
                    title={`What's included in ${planName}`}
                />
                <ModalBody>
                    <PlanFeatures features={allFeatures} inheritsIndividual={isNewTeamPlan} />
                </ModalBody>
            </Modal>
        </article>
    );
}
