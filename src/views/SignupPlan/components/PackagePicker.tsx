import { forwardRef, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { ChevronDown, X } from 'lucide-react';

import formatMinutesToHours from '@/utils/formatters/formatMinutesToHours';
import centsToDollars from '@/utils/formatters/centsToDollars';
import formatPrice from '@/utils/formatters/formatPrice';
import type { PricingOption } from '@/views/Subscription/types';

const afterDiscount = (base: number, discount: number) => (discount > 0 ? Math.max(0, base - discount) : base);

interface TriggerProps {
    selected: PricingOption | null;
    /** Final price of the selected package (discount applied). */
    selectedPrice: number;
    onOpen: () => void;
}

/** Full-width "Select your package" control that replaces the hours chip on team cards. */
export const PackageTrigger = forwardRef<HTMLButtonElement, TriggerProps>(function PackageTrigger(
    { selected, selectedPrice, onOpen },
    ref,
) {
    return (
        <button
            ref={ref}
            type="button"
            className={clsx('signupPlanPkgTrigger', selected && 'signupPlanPkgTrigger--selected')}
            aria-expanded={false}
            aria-haspopup="true"
            onClick={onOpen}
        >
            <span className="signupPlanPkgTriggerText">
                <span className="signupPlanPkgEyebrow">Team size &amp; hours</span>
                <span className="signupPlanPkgValue">
                    {selected
                        ? `${formatMinutesToHours(selected.includedMinutesPerMonth)} hrs / month`
                        : 'Select your package'}
                </span>
            </span>
            {selected && <span className="signupPlanPkgTriggerPrice">${formatPrice(selectedPrice)}</span>}
            <ChevronDown size={18} strokeWidth={1.75} aria-hidden="true" />
        </button>
    );
});

interface PanelProps {
    packages: PricingOption[];
    selected: PricingOption | null;
    discountDollars: number;
    hasReferralDiscount: boolean;
    onSelect: (option: PricingOption) => void;
    onClose: () => void;
}

/** Package options, expanded inside the card at full card width (pushes the content down). */
export function PackagePanel({ packages, selected, discountDollars, hasReferralDiscount, onSelect, onClose }: PanelProps) {
    const panelRef = useRef<HTMLDivElement>(null);

    // Move focus into the options when the panel opens: the selected one, else the first.
    useEffect(() => {
        const options = panelRef.current?.querySelectorAll<HTMLButtonElement>('.signupPlanPkgOption');
        const active = panelRef.current?.querySelector<HTMLButtonElement>('.signupPlanPkgOption--active');
        (active ?? options?.[0])?.focus();
    }, []);

    return (
        <div
            ref={panelRef}
            className="signupPlanPkgPanel"
            role="group"
            aria-label="Team size & hours"
            onKeyDown={(event) => {
                if (event.key === 'Escape') {
                    event.stopPropagation();
                    onClose();
                }
            }}
        >
            <div className="signupPlanPkgPanelHeader">
                <div>
                    <p className="signupPlanPkgPanelTitle">Team size &amp; hours</p>
                    <p className="signupPlanPkgPanelSubtitle">Pick the package that fits your team</p>
                </div>
                <button type="button" className="signupPlanPkgClose" aria-label="Close package options" onClick={onClose}>
                    <X size={16} strokeWidth={1.75} aria-hidden="true" />
                </button>
            </div>

            {hasReferralDiscount && discountDollars > 0 && (
                <p className="signupPlanPkgCredit">Referral credit applied to every package</p>
            )}

            <div className="signupPlanPkgList">
                {packages.map((option) => {
                    const base = centsToDollars(option.priceInCents);
                    const isActive = selected?.stripePriceId === option.stripePriceId;
                    return (
                        <button
                            key={option.stripePriceId}
                            type="button"
                            aria-pressed={isActive}
                            className={clsx('signupPlanPkgOption', isActive && 'signupPlanPkgOption--active')}
                            onClick={() => onSelect(option)}
                        >
                            <span className="signupPlanPkgDot" aria-hidden="true" />
                            <span className="signupPlanPkgOptionText">
                                <span className="signupPlanPkgOptionTitle">
                                    {formatMinutesToHours(option.includedMinutesPerMonth)} hrs / month
                                </span>
                                <span className="signupPlanPkgOptionMeta">Estimated team size: {option.teamSize}</span>
                            </span>
                            <span className="signupPlanPkgOptionPrice">
                                <span className="signupPlanPkgPriceNow">${formatPrice(afterDiscount(base, discountDollars))}</span>
                                {discountDollars > 0 && (
                                    <span className="signupPlanPkgPriceWas">${formatPrice(base)}</span>
                                )}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
