import { BadgePercent } from 'lucide-react';

/** Shown when a referral discount or an offer token is reflected in the prices (Figma 557:13177). */
export default function SpecialPricingBanner() {
    return (
        <div className="signupPlanSpecial" role="status">
            <BadgePercent size={24} strokeWidth={1.75} aria-hidden="true" />
            <div className="signupPlanSpecialText">
                <p className="signupPlanSpecialTitle">Special pricing available</p>
                <p className="signupPlanSpecialBody">Your eligible offer is reflected in the prices below.</p>
            </div>
        </div>
    );
}
