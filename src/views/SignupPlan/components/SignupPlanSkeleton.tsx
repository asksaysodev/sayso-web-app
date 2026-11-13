/**
 * Loading state for the plan view: the billing toggle and two plan cards, built on the real
 * card shell so the skeleton has the same footprint as the loaded page.
 */
function PlanCardSkeleton() {
    return (
        <div className="signupPlanCard">
            <div className="signupPlanCardContent">
                <div className="signupPlanCardHeading">
                    <div className="skeleton signupPlanSkeletonIcon" />
                    <div className="skeleton signupPlanSkeletonName" />
                </div>

                <div className="signupPlanCardBody">
                    <div className="signupPlanPriceBlock">
                        <div className="skeleton signupPlanSkeletonPrice" />
                        <div className="skeleton signupPlanSkeletonPriceSub" />
                    </div>
                    <div className="skeleton signupPlanSkeletonChip" />
                    <div className="skeleton signupPlanSkeletonCta" />
                </div>

                <div className="signupPlanIncluded">
                    <div className="skeleton signupPlanSkeletonIncluded" />
                </div>
            </div>
        </div>
    );
}

export default function SignupPlanSkeleton() {
    return (
        <div className="signupPlan" role="status" aria-label="Loading plans">
            <div className="signupPlanToolbar">
                <div className="skeleton signupPlanSkeletonToggle" />
            </div>
            <div className="signupPlanCards">
                <PlanCardSkeleton />
                <PlanCardSkeleton />
            </div>
        </div>
    );
}
