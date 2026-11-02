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
            {feature.name}
        </li>
    );
}

function FeatureSection({ title, features }: { title: string; features: PlanFeature[] }) {
    return (
        <section className="signupPlanFeatureSection">
            <h3 className="signupPlanFeaturesHead">{title}</h3>
            <ul className="signupPlanFeatureList">
                {features.map((feature) => <FeatureRow key={feature.id} feature={feature} />)}
            </ul>
        </section>
    );
}

export default function PlanFeatures({ features, inheritsIndividual }: Props) {
    if (inheritsIndividual) {
        return (
            <div className="signupPlanFeatures">
                <section className="signupPlanFeatureSection">
                    <h3 className="signupPlanFeaturesHead">Everything in Individual +, plus:</h3>
                    <ul className="signupPlanFeatureList">
                        {features.map((feature) => <FeatureRow key={feature.id} feature={feature} />)}
                    </ul>
                </section>
            </div>
        );
    }

    const featureItems = features.filter((f) => f.type !== 'benefit');
    const benefitItems = features.filter((f) => f.type === 'benefit');

    return (
        <div className="signupPlanFeatures">
            {featureItems.length > 0 && <FeatureSection title="Features" features={featureItems} />}
            {benefitItems.length > 0 && <FeatureSection title="Benefits" features={benefitItems} />}
        </div>
    );
}
