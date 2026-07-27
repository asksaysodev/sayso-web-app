import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPartnerInvoices } from '../services/getPartnerInvoices';
import reportApiError from '@/utils/reportApiError';

export function usePartnerInvoices(partnerId: string) {
    const { data, isLoading, isError, error, isFetching, refetch } = useQuery({
        queryKey: ['admin-partner-invoices', partnerId],
        queryFn: () => getPartnerInvoices(partnerId),
    });

    useEffect(() => {
        if (error) reportApiError(error, { feature: 'admin-partner-invoices', operation: 'getPartnerInvoices' });
    }, [error]);

    const invoices = data?.invoices ?? [];

    return {
        invoices,
        stripeCustomerUrl: data?.stripeCustomerUrl ?? null,
        isLoading,
        isError,
        isRetrying: isFetching && !isLoading,
        retry: refetch,
        isEmpty: !isLoading && !isError && invoices.length === 0,
    };
}
