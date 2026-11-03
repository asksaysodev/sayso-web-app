import { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { X } from 'lucide-react';

import formatMinutesToHours from '@/utils/formatters/formatMinutesToHours';
import centsToDollars from '@/utils/formatters/centsToDollars';
import formatPrice from '@/utils/formatters/formatPrice';
import type { PricingOption } from '@/views/Subscription/types';

const afterDiscount = (base: number, discount: number) => (discount > 0 ? Math.max(0, base - discount) : base);

interface Props {
    open: boolean;
    packages: PricingOption[];
    selected: PricingOption | null;
    discountDollars: number;
    hasReferralDiscount: boolean;
    onSelect: (option: PricingOption) => void;
    onClose: () => void;
}

/**
 * Package options as an overlay covering the whole plan card (absolute, inset 0), so the card keeps
 * its closed-state height. The options list scrolls when it does not fit.
 */
export default function PackageOverlay({ open, packages, selected, discountDollars, hasReferralDiscount, onSelect, onClose }: Props) {
    const overlayRef = useRef<HTMLDivElement>(null);

    // Move focus into the overlay when it opens: the selected option, else the first.
    useEffect(() => {
        if (!open) return;
        const options = overlayRef.current?.querySelectorAll<HTMLButtonElement>('.signupPlanPkgOption');
        const active = overlayRef.current?.querySelector<HTMLButtonElement>('.signupPlanPkgOption--active');
        (active ?? options?.[0])?.focus();
    }, [open]);

    // Always mounted so it can slide in and out; while closed it is hidden and inert.
    return (
        <div
            ref={overlayRef}
            className={`signupPlanPkgOverlay${open ? ' signupPlanPkgOverlay--open' : ''}`}
            role="dialog"
            aria-label="Team size & hours"
            aria-hidden={open ? undefined : true}
            inert={!open}
            onKeyDown={(event) => {
                if (event.key === 'Escape') {
                    event.stopPropagation();
                    onClose();
                }
            }}
        >
            <div className="signupPlanPkgOverlayHeader">
                <div>
                    <p className="signupPlanPkgOverlayTitle">Team size &amp; hours</p>
                    <p className="signupPlanPkgOverlaySubtitle">Pick the package that fits your team</p>
                </div>
                <button type="button" className="signupPlanPkgClose" aria-label="Close package options" onClick={onClose}>
                    <X size={18} strokeWidth={1.75} aria-hidden="true" />
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
                            <span className="signupPlanPkgOptionTitle">
                                {formatMinutesToHours(option.includedMinutesPerMonth)} hrs / month
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
