import { useQuery } from '@tanstack/react-query';
import { getProvider } from './providers/registry';
import type { CrmProviderId } from './types';

/** Fetches one CRM person (for the edit modal prefill). */
export default function useCrmLead(providerId: CrmProviderId | null, leadId: string | null, enabled: boolean) {
    return useQuery({
        queryKey: ['crm-lead', providerId, leadId],
        queryFn: () => getProvider(providerId as CrmProviderId).getLead(leadId as string),
        enabled: enabled && !!providerId && !!leadId,
        retry: false,
        gcTime: 0,
    });
}
