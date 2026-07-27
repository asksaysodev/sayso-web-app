import { useEffect, useMemo, useRef, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import useCrmConnection from './useCrmConnection';
import { getProvider } from './providers/registry';
import { CrmReauthRequiredError } from './errors';
import type { CrmLead, CrmProviderId } from './types';

const LEADS_PER_PAGE = 25;

interface Options {
    enabled?: boolean; // set to false when the dropdown is closed to avoid background fetches
}

export default function useCrmLeads(search = '', options: Options = {}) {
    const { isConnected, providerId } = useCrmConnection();
    const { globalUser, updateGlobalUser } = useAuth();
    const queryEnabled = isConnected && !!providerId && (options.enabled ?? true);

    const [reauthProviderId, setReauthProviderId] = useState<CrmProviderId | null>(null);
    const reauthHandled = useRef(false);

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
        retry: (failureCount, err) => !(err instanceof CrmReauthRequiredError) && failureCount < 3,
    });

    if (error instanceof CrmReauthRequiredError) {
        if (reauthProviderId !== error.providerId) setReauthProviderId(error.providerId);
    } else if (isConnected && reauthProviderId) {
        setReauthProviderId(null);
    }

    useEffect(() => {
        if (!reauthProviderId) {
            reauthHandled.current = false;
            return;
        }
        if (reauthHandled.current) return;
        reauthHandled.current = true;
        if (globalUser?.email) updateGlobalUser(globalUser.email);
    }, [reauthProviderId, globalUser?.email, updateGlobalUser]);

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
        needsReauth: !!reauthProviderId,
        reauthProviderLabel: reauthProviderId ? getProvider(reauthProviderId).label : null,
        hasNextPage: hasNextPage ?? false,
        isFetchingNextPage,
        fetchNextPage,
    };
}
