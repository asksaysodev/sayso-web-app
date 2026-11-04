import { Gift, Sparkles } from 'lucide-react';

import type { PlanFeature } from '@/views/Subscription/types';

import FeatureSection from './FeatureSection';

interface Props {
    features: PlanFeature[];
    /** New-generation team plans inherit the Individual catalog: one intro line, then every item. */
    inheritsIndividual: boolean;
}

export default function PlanFeatures({ features, inheritsIndividual }: Props) {
    if (inheritsIndividual) {
        return (
            <div className="signupPlanFeatures">
                <FeatureSection title="Everything in Individual +, plus" icon={Sparkles} features={features} />
            </div>
        );
    }

    const featureItems = features.filter((f) => f.type !== 'benefit');
    const benefitItems = features.filter((f) => f.type === 'benefit');

    return (
        <div className="signupPlanFeatures">
            {featureItems.length > 0 && <FeatureSection title="Features" icon={Sparkles} features={featureItems} />}
            {benefitItems.length > 0 && <FeatureSection title="Benefits" icon={Gift} features={benefitItems} />}
        </div>
    );
}
