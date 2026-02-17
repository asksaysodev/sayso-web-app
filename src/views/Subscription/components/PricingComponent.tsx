import { useMutation } from "@tanstack/react-query";
import { useMemo } from "react";
import { FaMinus, FaCheck } from "react-icons/fa";
import getStripeCheckoutPageUrl from "../services/getStripeCheckoutPageUrl";
import { useToast } from "@/context/ToastContext";
import useStripeCheckout from "../hooks/useStripeCheckout";
import ButtonSpinner from "@/components/ButtonSpinner";
import { useAuth } from "@/context/AuthContext";
import formatMinutesToHours from "@/utils/formatters/formatMinutesToHours";
import { BillingInterval, BillingIntervalEnum, PricingPlan } from "../types";
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
        popular = false, 
        contactLink, 
        hasTrial = false, 
        trialDays = null, 
        trialIncludedMinutes = null 
    } = plan || {};

    const { globalUser } = useAuth();
    const { isPendingGetStripeCheckoutPageUrl, mutateGetStripeCheckoutPageUrl} = useStripeCheckout();

    const pricingOptionSelected = useMemo(() => pricingOptions ? pricingOptions.find(opt => opt.interval === selectedBillingTab) ?? null : null, [pricingOptions, selectedBillingTab]);
    const priceInDollars = pricingOptionSelected ? (pricingOptionSelected.priceInCents / 100).toFixed(0) : 0;
    const includedHoursPerMonth = formatMinutesToHours(pricingOptionSelected?.includedMinutesPerMonth ?? 0);
    const freeTrialHours = formatMinutesToHours(trialIncludedMinutes ?? 0);
    // Backend sends total price for the billing period (monthly: $79, annual: $853.20)
    // For annual plans, we display the effective monthly cost to show savings ($71.10 per month vs $79 per month)
    const pricePerMonth = useMemo(() => {
        return selectedBillingTab === BillingIntervalEnum.MONTH 
            ? priceInDollars 
            : (Number(priceInDollars) / 12).toFixed(2);
    }, [priceInDollars, selectedBillingTab]);

    const handlePurchase = () => {
        if (purchasable && pricingOptionSelected) {
            mutateGetStripeCheckoutPageUrl(pricingOptionSelected.stripePriceId);
        } else {
            if (contactLink) {
                openExternal(contactLink);
            }
        }
    }

    const alreadySubscribed = useMemo(() =>
        globalUser?.subscription_plan_id === plan?.id,
    [globalUser, plan]);

    return (
        <div className="pricing-card">
            {popular && <div className="pricing-card-popular-tag">Most popular</div>}

            <div className="pricing-card-header">
                <h2 className="pricing-plan-name">{planName}</h2>
                {purchasable &&
                    <div className="pricing-price-and-included-hours-container">
                        <div className="pricing-amount-container">
                            <span className="pricing-currency">$</span>
                            <span className="pricing-amount">{pricePerMonth}</span>
                            <span className="pricing-period">per month</span>
                        </div>
                        <span className="pricing-included-hours">{includedHoursPerMonth} hours included</span>
                    </div>
                }

                <button 
                    disabled={isPendingGetStripeCheckoutPageUrl || alreadySubscribed} 
                    className={`pricing-cta-button ${popular ? 'pricing-cta-button-popular' : ''} ${alreadySubscribed ? 'pricing-cta-button-current-plan' : ''}`} 
                    onClick={handlePurchase}
                    style={{ opacity: isPendingGetStripeCheckoutPageUrl ? 0.7 : 1 }}
                >
                    {isPendingGetStripeCheckoutPageUrl && (
                        <ButtonSpinner 
                            color={popular ? 'white' : '#1F2937'} 
                            size={14} 
                        />
                    )}
                    {purchasable ? alreadySubscribed ? 'Current plan' : 'Get started' : 'Contact sales'}
                </button>

                {hasTrial && !alreadySubscribed && (
                    <div>
                        <button className="pricing-trial-button" onClick={handlePurchase}>
                            <p className="pricing-trial-text bold-text">Get {freeTrialHours} free hours of Live AI Coaching</p>
                        </button>
                        <p className="pricing-trial-text">Valid for {trialDays} days</p>
                    </div>
                )}
            </div>

            <div className="pricing-features-section">
                <h3 className="pricing-features-title">FEATURES</h3>
                <p className="pricing-features-subtitle">{description}</p>
                
                <ul className="pricing-features-list">
                    {features && features?.features && features.features.map((feature) => (
                        <li key={feature.id} className="pricing-feature-item">
                            <div className={`pricing-feature-icon ${feature.included ? 'included' : 'not-included'}`}>
                                {feature.included
                                    ? <FaCheck color="white" size={10}/>
                                    : <FaMinus color="white" size={10}/>
                                }
                            </div>
                            <span className="pricing-feature-text">{feature.name}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}