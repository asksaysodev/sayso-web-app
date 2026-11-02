import { Check, Info, Minus } from 'lucide-react';
import clsx from 'clsx';
import type { PlanFeature } from '@/views/Subscription/types';

interface Props {
    features: PlanFeature[];
    /** New-generation team plans inherit the Individual catalog: one intro line, then every item. */
    inheritsIndividual: boolean;
}

function FeatureRow({ feature }: { feature: PlanFeature }) {
    return (
        <li className={clsx('signupPlanFeature', !feature.included && 'signupPlanFeature--disabled')}>
            {feature.included
                ? <Check size={14} strokeWidth={2} aria-hidden="true" className="signupPlanFeatureIcon" />
                : <Minus size={14} strokeWidth={2} aria-hidden="true" className="signupPlanFeatureIcon" />}
            <span>{feature.name}</span>
            {feature.detail && (
                <span className="signupPlanFeatureInfo" tabIndex={0} aria-label={feature.detail}>
                    <Info size={13} aria-hidden="true" />
                    <span className="signupPlanFeatureTooltip" role="tooltip">{feature.detail}</span>
                </span>
            )}
        </li>
    );
}

export default function PlanFeatures({ features, inheritsIndividual }: Props) {
    if (inheritsIndividual) {
        return (
            <div className="signupPlanFeatures">
                <p className="signupPlanFeaturesHead signupPlanFeaturesHead--intro">Everything in Individual +, plus:</p>
                <ul className="signupPlanFeatureList">
                    {features.map((feature) => <FeatureRow key={feature.id} feature={feature} />)}
                </ul>
            </div>
        );
    }

    const featureItems = features.filter((f) => f.type !== 'benefit');
    const benefitItems = features.filter((f) => f.type === 'benefit');

    return (
        <div className="signupPlanFeatures">
            <p className="signupPlanFeaturesHead">FEATURES</p>
            <ul className="signupPlanFeatureList">
                {featureItems.map((feature) => <FeatureRow key={feature.id} feature={feature} />)}
            </ul>
            {benefitItems.length > 0 && (
                <>
                    <p className="signupPlanFeaturesHead">BENEFITS</p>
                    <ul className="signupPlanFeatureList">
                        {benefitItems.map((feature) => <FeatureRow key={feature.id} feature={feature} />)}
                    </ul>
                </>
            )}
        </div>
    );
}
