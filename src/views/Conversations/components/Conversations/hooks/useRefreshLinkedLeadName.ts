import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import type { GetConversationsResponse } from '@/types/coach';
import type { CrmProviderId } from '@/hooks/integrations/crm/types';
import { CONVERSATIONS_QUERY_KEY } from '../../../queryKeys';

/**
 * After editing a CRM lead, updates `crm_lead_name` in the conversations cache for every
 * conversation linked to that lead (same id + provider), then invalidates to resync.
 */
export default function useRefreshLinkedLeadName() {
    const queryClient = useQueryClient();

    return ({ leadId, providerId, crmLeadName }: { leadId: string; providerId: CrmProviderId; crmLeadName: string }) => {
        queryClient.setQueriesData<InfiniteData<GetConversationsResponse>>(
            { queryKey: CONVERSATIONS_QUERY_KEY },
            old => {
                if (!old) return old;
                return {
                    ...old,
                    pages: old.pages.map(page => ({
                        ...page,
                        conversations: page.conversations.map(conv =>
                            conv.crm_lead_id === leadId && conv.crm_provider === providerId
                                ? { ...conv, crm_lead_name: crmLeadName }
                                : conv
                        ),
                    })),
                };
            }
        );
        queryClient.invalidateQueries({ queryKey: CONVERSATIONS_QUERY_KEY });
    };
}
