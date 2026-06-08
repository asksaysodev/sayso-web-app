import { useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import useCrmConnection from './useCrmConnection';
import { getProvider } from './providers/registry';
import type { CrmLead } from './types';

const LEADS_PER_PAGE = 25;

interface Options {
    enabled?: boolean; // set to false when the dropdown is closed to avoid background fetches
}

export default function useCrmLeads(search = '', options: Options = {}) {
    const { isConnected, providerId } = useCrmConnection();
    const queryEnabled = isConnected && !!providerId && (options.enabled ?? true);

    const {
        data,
        isLoading,
        error,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
    } = useInfiniteQuery({
        queryKey: ['crm-leads', providerId, search],
        queryFn: ({ pageParam }) => {
            const provider = getProvider(providerId!);
            return provider.fetchLeads({
                search: search || undefined,
                limit: LEADS_PER_PAGE,
                offset: pageParam as number,
            });
        },
        getNextPageParam: (lastPage) => lastPage.nextOffset ?? undefined,
        initialPageParam: 0,
        enabled: queryEnabled,
        staleTime: 60_000,
    });

    const leads = useMemo<CrmLead[]>(() => {
        if (!data?.pages) return [];
        return data.pages.flatMap(p => p.leads);
    }, [data]);

    const total = data?.pages[0]?.total ?? 0;

    return {
        leads,
        total,
        isLoading,
        error,
        hasNextPage: hasNextPage ?? false,
        isFetchingNextPage,
        fetchNextPage,
    };
}
