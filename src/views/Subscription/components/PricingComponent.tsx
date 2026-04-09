import useHasSubscription from "@/hooks/useHasSubscription";
import useStripeCheckout from "../hooks/useStripeCheckout";
import { BillingInterval, BillingIntervalEnum, PricingOption, PricingPlan } from "../types";
import '../styles/PricingComponent.css';
import { useEffect, useMemo, useState } from "react";
import formatMinutesToHours from "@/utils/formatters/formatMinutesToHours";
import centsToDollars from "@/utils/formatters/centsToDollars";
import formatPrice from "@/utils/formatters/formatPrice";
import ButtonSpinner from "@/components/ButtonSpinner";
import { openExternal } from "@/utils/helpers/openExternal";

interface Props {
plan: PricingPlan | null;
selectedBillingTab: BillingInterval;
}
    
export default function PricingComponent({ plan = null, selectedBillingTab = BillingIntervalEnum.MONTH }: Props) {
    const {
        name: planName,
        description,
        features,
        pricingOptions,
        purchasable,
        contactLink,
        trialDays = null,
        trialIncludedMinutes = null,
        hasPackages
    } = plan || {};
    
    const [packageSelected, setPackageSelected] = useState<null | PricingOption>(null);
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);

    useEffect(() => {
        const resetPackages = () =>{
            setPackageSelected(null);
        }
        resetPackages();
    }, [selectedBillingTab]);

    const hasSubscription = useHasSubscription();
    const {  isPendingGetStripeCheckoutPageUrl, mutateGetStripeCheckoutPageUrl } = useStripeCheckout();

    const availablePackages = useMemo(() =>
        pricingOptions ? pricingOptions.filter(opt => opt.interval === selectedBillingTab) : [],
        [pricingOptions, selectedBillingTab]);

    const pricingOptionSelected = useMemo(() =>
        pricingOptions ? pricingOptions.find(opt => opt.interval === selectedBillingTab) ?? null : null,
        [pricingOptions, selectedBillingTab]);

    const effectivePricingOption = hasPackages ? packageSelected : pricingOptionSelected;

    const priceInDollars = effectivePricingOption ? centsToDollars(effectivePricingOption.priceInCents) : 0;
    const includedHoursPerMonth = formatMinutesToHours(effectivePricingOption?.includedMinutesPerMonth ?? 0);
    const freeTrialHours = formatMinutesToHours(trialIncludedMinutes ?? 0);

    const startingPriceInDollars = useMemo(() => {
        if (!hasPackages || !availablePackages.length) return null;
        return centsToDollars(Math.min(...availablePackages.map(opt => opt.priceInCents)));
    }, [hasPackages, availablePackages]);

    const openOverlay = () => {
        setIsOverlayOpen(true);
    };

    const closeOverlay = () => setIsOverlayOpen(false);

    const confirmPackage = (pricingPackage: PricingOption) => {
        if (packageSelected && pricingPackage.stripePriceId === packageSelected?.stripePriceId) return;
        setPackageSelected(pricingPackage);
        closeOverlay();
    };

    const handleCta = () => {
        if (hasPackages && !packageSelected) {
            openOverlay();
            return;
        }
        if (purchasable && effectivePricingOption) {
            mutateGetStripeCheckoutPageUrl(effectivePricingOption.stripePriceId);
            return;
        }
        if (contactLink) openExternal(contactLink);
    };

    return (
    <div className="col">
        <div className="card">
            <div className="card-inner">
                <div className="card-header">
                    <div className="plan-name">{planName}</div>
                    {purchasable && (
                        <>
                            <div className="price-row">
                                <span className="price-amount">${formatPrice(hasPackages && !packageSelected ? startingPriceInDollars ?? 0 : priceInDollars)}</span>
                                <span className="price-period">/ {selectedBillingTab}{hasPackages && !packageSelected ? '*' : ''}</span>
                            </div>
                            <div className="hours-sub">
                                {hasPackages && !packageSelected
                                    ? `*plans start at $${formatPrice(startingPriceInDollars ?? 0)} / ${selectedBillingTab}`
                                    : `${includedHoursPerMonth} hours included`
                                }
                            </div>
                        </>
                    )}
                </div>

            {hasPackages
                ? <div className="pkg-trigger-wrapper">
                        <button
                            className={`pkg-trigger${packageSelected ? ' has-selection' : ''}${isOverlayOpen ? ' open' : ''}`}
                            onClick={openOverlay}
                        >
                            <div className="pkg-trigger-left">
                                <span className="pkg-trigger-eyebrow">Team size &amp; hours</span>
                                <span className={`pkg-trigger-value${packageSelected ? '' : ' placeholder'}`}>
                                    {packageSelected
                                        ? `${formatMinutesToHours(packageSelected.includedMinutesPerMonth)} hrs / month`
                                        : 'Choose your package'
                                    }
                                </span>
                            </div>
                            <div className="pkg-trigger-right">
                                <span className="pkg-trigger-price">
                                    {packageSelected ? `$${formatPrice(priceInDollars)}` : ''}
                                </span>
                                <svg className="chevron" viewBox="0 0 18 18" fill="none">
                                    <path d="M4.5 6.75L9 11.25L13.5 6.75" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                        </button>
                    </div>
                : <div className="pkg-trigger-wrapper">
                    <div className="promo">
                        <strong>Get {freeTrialHours} free hours of Live AI Coaching</strong>
                        <span>Valid for {trialDays} days</span>
                    </div>
                </div>
            }

            <div className="cta-section">
                <button
                    className="cta-btn"
                    disabled={isPendingGetStripeCheckoutPageUrl || hasSubscription}
                    onClick={handleCta}
                    style={{ opacity: isPendingGetStripeCheckoutPageUrl ? 0.7 : 1 }}
                >
                    {isPendingGetStripeCheckoutPageUrl && (
                        <ButtonSpinner color="white" size={14} />
                    )}
                    {purchasable ? hasSubscription ? 'Current plan' : 'Get started' : 'Contact sales'}
                </button>
            </div>

            <div className={`overlay-panel${isOverlayOpen ? ' open' : ''}`}>
                <div className="overlay-header">
                    <div>
                        <div className="overlay-title">Team size &amp; hours</div>
                        <div className="overlay-subtitle">Pick the package that fits your team</div>
                    </div>
                    <button className="close-btn" onClick={closeOverlay}>
                        <svg viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                    </button>
                </div>

                <div className="tier-list">
                    {availablePackages.map((opt) => (
                        <div
                            key={opt.stripePriceId}
                            className={`tier-card${packageSelected?.stripePriceId === opt.stripePriceId ? ' active' : ''}`}
                            onClick={() => confirmPackage(opt)}
                        >
                            <div className="tier-left">
                                <div className="tier-dot"></div>
                                <div>
                                    <div className="tier-agents">{formatMinutesToHours(opt.includedMinutesPerMonth)} hrs / month</div>
                                    <div className="tier-hours">Estimated team size:</div>
                                    <div className="tier-hours">{opt.teamSize}</div>
                                </div>
                            </div>
                            <div className="tier-price-tag">${formatPrice(centsToDollars(opt.priceInCents))}</div>
                        </div>
                    ))}
                </div>
            </div>
    
            <div className="features-section">
                <div className="features-title">Features</div>
                <div className="features-subtitle">{description}</div>
                {features && features?.features && features.features.map((feature) => (
                    <div key={feature.id} className={`feature-item${feature.included ? '' : ' disabled'}`}>
                        {feature.included
                            ? <div className="check-icon"><svg viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
                            : <div className="minus-icon"><svg viewBox="0 0 10 10" fill="none"><path d="M2 5h6" stroke="#b0bac8" stroke-width="1.8" stroke-linecap="round"/></svg></div>
                        }
                        {feature.name}
                    </div>
                ))}
            </div>
        </div>
        </div>
    </div>
    )
    }