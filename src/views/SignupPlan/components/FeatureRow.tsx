import clsx from 'clsx';
import { Check, Minus } from 'lucide-react';

import type { PlanFeature } from '@/views/Subscription/types';

interface Props {
    feature: PlanFeature;
}

export default function FeatureRow({ feature }: Props) {
    const Icon = feature.included ? Check : Minus;
    return (
        <li className={clsx('signupPlanFeature', !feature.included && 'signupPlanFeature--disabled')}>
            <span className="signupPlanFeatureIcon" aria-hidden="true">
                <Icon size={14} strokeWidth={2.5} />
            </span>
            <span>{feature.name}</span>
        </li>
    );
}
