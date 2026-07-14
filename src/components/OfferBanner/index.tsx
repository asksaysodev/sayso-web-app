import { LuGift } from "react-icons/lu";
import { getOfferToken } from "@/utils/offerToken";
import "./OfferBanner.css";

/**
 * Persistent banner shown across the signup/subscription flow while a legacy
 * offer token is active (SAYSO-317). Renders nothing when no token is present.
 */
export default function OfferBanner() {
    const offerToken = getOfferToken();
    if (!offerToken) return null;

    return (
        <div className="offer-banner" role="status">
            <span className="offer-banner-icon">
                <LuGift size={16} />
            </span>
            <span className="offer-banner-text">
                You're signing up with a <strong>temporary offer</strong> — special pricing is applied while it's active.
            </span>
        </div>
    );
}
