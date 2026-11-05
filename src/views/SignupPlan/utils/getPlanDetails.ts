import type { PricingPlan } from '@/views/Subscription/types';

import { PLAN_DETAILS, type PlanDetailsConfig } from '../constants/planDetails';

/**
 * Details config for a plan's modal: the static copy for new-generation purchasable plans,
 * otherwise built from the plan's API features (legacy, offer and contact-sales plans).
 */
export default function getPlanDetails(plan: PricingPlan): PlanDetailsConfig {
    if (plan.generation === 'new' && plan.purchasable && plan.accountType) return PLAN_DETAILS[plan.accountType];

    const included = (plan.features?.features ?? []).filter((feature) => feature.included);
    return {
        capabilities: included
            .filter((feature) => feature.type !== 'benefit')
            .map((feature) => ({ name: feature.name, description: feature.detail })),
        perks: included.filter((feature) => feature.type === 'benefit').map((feature) => feature.name),
    };
}
