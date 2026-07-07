import { useQuery } from '@tanstack/react-query';
import getPartnerPlanOptions from '../services/getPartnerPlanOptions';
import centsToDollars from '@/utils/formatters/centsToDollars';
import type { TeamPlanOption } from '../types';

export function useTeamPlans() {
    const { data, isLoading } = useQuery({
        queryKey: ['partner-plan-options'],
        queryFn: getPartnerPlanOptions,
        staleTime: 5 * 60 * 1000,
    });

    const plans: TeamPlanOption[] = (data ?? [])
        .map(opt => ({
            id: opt.id,
            label: `${opt.plan_name} · ${opt.team_size} · $${centsToDollars(opt.price_in_cents)}/mo`,
            priceInCents: opt.price_in_cents,
        }))
        .sort((a, b) => a.priceInCents - b.priceInCents);

    return { plans, isLoading };
}
