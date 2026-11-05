import { InfiniteData, QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';
import { updateConversationLead } from '../../../services/updateConversation';
import * as Sentry from '@sentry/react';
import { useToast } from '@/context/ToastContext';
import type { GetConversationsResponse } from '@/types/coach';
import type { CrmLead } from '@/hooks/integrations/crm/types';
import { CONVERSATIONS_QUERY_KEY } from '../../../queryKeys';


interface AttachLeadParams {
    conversationId: string;
    lead: CrmLead | null;
}

export default function useAttachConversationLead() {
    const { showToast } = useToast();
    const queryClient = useQueryClient();

    const { mutate: attachLead, isPending } = useMutation({
        mutationFn: ({ conversationId, lead }: AttachLeadParams) =>
            updateConversationLead(conversationId, {
                crm_lead_id: lead?.id ?? null,
                crm_lead_name: lead?.name ?? null,
                crm_provider: lead?.providerId ?? null,
            }),
        onMutate: async ({ conversationId, lead }) => {
            await queryClient.cancelQueries({ queryKey: CONVERSATIONS_QUERY_KEY });

            const previousData = queryClient.getQueriesData<InfiniteData<GetConversationsResponse>>({
                queryKey: CONVERSATIONS_QUERY_KEY,
            });

            // Optimistically flip crm_lead_name so the card shows avatar+name immediately
            queryClient.setQueriesData<InfiniteData<GetConversationsResponse>>(
                { queryKey: CONVERSATIONS_QUERY_KEY },
                (old) => {
                    if (!old) return old;
                    return {
                        ...old,
                        pages: old.pages.map(page => ({
                            ...page,
                            conversations: page.conversations.map(conv =>
                                conv.id === conversationId
                                    ? {
                                        ...conv,
                                        crm_lead_name: lead?.name ?? null,
                                        crm_lead_id: lead?.id ?? null,
                                        crm_provider: lead?.providerId ?? null,
                                    }
                                    : conv
                            ),
                        })),
                    };
                }
            );

            return { previousData };
        },
        onError: (error, _variables, context) => {
            context?.previousData?.forEach(([key, data]: [QueryKey, InfiniteData<GetConversationsResponse> | undefined]) => {
                queryClient.setQueryData(key, data);
            });
            showToast('error', 'Failed to link lead. Please try again.');
            Sentry.captureException(error);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: CONVERSATIONS_QUERY_KEY });
        },
    });

    return { attachLead, isPending };
}
