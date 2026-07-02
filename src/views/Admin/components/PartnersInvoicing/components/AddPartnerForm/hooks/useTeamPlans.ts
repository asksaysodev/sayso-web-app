import { useQuery } from '@tanstack/react-query';
import getSubscriptionPlans from '@/views/Subscription/services/getSubscriptionPlans';
import centsToDollars from '@/utils/formatters/centsToDollars';
import type { TeamPlanOption } from '../types';

export function useTeamPlans() {
    const { data, isLoading } = useQuery({
        queryKey: ['subscription-plans'],
        queryFn: getSubscriptionPlans,
        staleTime: 5 * 60 * 1000,
    });

    const plans: TeamPlanOption[] = (data ?? [])
        .filter(plan => plan.hasPackages)
        .flatMap(plan =>
            plan.pricingOptions
                .filter(opt => opt.interval === 'month')
                .map(opt => ({
                    id: opt.stripePriceId,
                    label: `${opt.planName} · ${opt.teamSize} · $${centsToDollars(opt.priceInCents)}/mo`,
                    priceInCents: opt.priceInCents,
                }))
        )
        .sort((a, b) => a.priceInCents - b.priceInCents);

    return { plans, isLoading };
}
