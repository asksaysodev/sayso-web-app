import type { LucideIcon } from 'lucide-react';

import type { PlanFeature } from '@/views/Subscription/types';

import FeatureRow from './FeatureRow';

interface Props {
    title: string;
    icon: LucideIcon;
    features: PlanFeature[];
}

export default function FeatureSection({ title, icon: Icon, features }: Props) {
    return (
        <section className="signupPlanFeatureSection">
            <h3 className="signupPlanFeaturesHead">
                <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
                {title}
            </h3>
            <ul className="signupPlanFeatureList">
                {features.map((feature) => <FeatureRow key={feature.id} feature={feature} />)}
            </ul>
        </section>
    );
}
