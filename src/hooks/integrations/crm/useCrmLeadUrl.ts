import { useQuery } from '@tanstack/react-query';
import { getProvider } from './providers/registry';
import type { CrmProviderId } from './types';

/**
 * URL of a lead's page in its CRM, or null while unknown / when it can't be built
 * (the caller hides the "Open in CRM" item). Provider context (e.g. FUB domain)
 * is fetched only when `enabled` and cached.
 */
export default function useCrmLeadUrl(providerId: CrmProviderId | null, leadId: string | null, enabled: boolean): string | null {
    const provider = providerId ? getProvider(providerId) : null;
    const needsContext = !!provider?.fetchLeadUrlContext;
    const { data: context, isError } = useQuery({
        queryKey: ['crm-lead-url-context', providerId],
        queryFn: () => provider!.fetchLeadUrlContext!(),
        enabled: enabled && needsContext,
        staleTime: 24 * 60 * 60 * 1000,
        retry: false,
    });

    if (!provider || !leadId) return null;
    if (!needsContext) return provider.buildLeadUrl(leadId, null);
    if (isError || !context) return null;
    return provider.buildLeadUrl(leadId, context);
}
