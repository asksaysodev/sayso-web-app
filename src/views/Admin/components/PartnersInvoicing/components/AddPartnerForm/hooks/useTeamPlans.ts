import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import getPartnerPlanOptions from '../services/getPartnerPlanOptions';
import { formatInvoiceAmount } from '../../helpers/formatInvoiceAmount';
import reportApiError from '@/utils/reportApiError';
import type { TeamPlanOption } from '../types';

export function useTeamPlans() {
    const { data, isLoading, isError, error, isFetching, refetch } = useQuery({
        queryKey: ['partner-plan-options'],
        queryFn: getPartnerPlanOptions,
        staleTime: 5 * 60 * 1000,
    });

    useEffect(() => {
        if (error) reportApiError(error, { feature: 'admin-partners', operation: 'getPartnerPlanOptions' });
    }, [error]);

    const plans: TeamPlanOption[] = (data ?? [])
        .map(opt => ({
            id: opt.id,
            label: `${opt.plan_name} · ${opt.team_size} · ${formatInvoiceAmount(opt.price_in_cents, 'usd')}/mo`,
            priceInCents: opt.price_in_cents,
        }))
        .sort((a, b) => a.priceInCents - b.priceInCents);

    return {
        plans,
        isLoading,
        isError,
        isRetrying: isFetching && !isLoading,
        retry: refetch,
    };
}
