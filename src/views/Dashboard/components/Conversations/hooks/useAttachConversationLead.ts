import { InfiniteData, QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';
import { updateConversationLead } from '../../../services/updateConversation';
import * as Sentry from '@sentry/react';
import { useToast } from '@/context/ToastContext';
import type { GetConversationsResponse } from '@/types/coach';
import type { CrmLead } from '@/hooks/integrations/crm/types';

const CONVERSATIONS_KEY = ['dashboard-conversations'];

interface AttachLeadParams {
    conversationId: string;
    lead: CrmLead | null; // null = unassign
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
            await queryClient.cancelQueries({ queryKey: CONVERSATIONS_KEY });

            const previousData = queryClient.getQueriesData<InfiniteData<GetConversationsResponse>>({
                queryKey: CONVERSATIONS_KEY,
            });

            // Optimistically flip crm_lead_name so the card shows avatar+name immediately
            queryClient.setQueriesData<InfiniteData<GetConversationsResponse>>(
                { queryKey: CONVERSATIONS_KEY },
                (old) => {
                    if (!old) return old;
                    return {
                        ...old,
                        pages: old.pages.map(page => ({
                            ...page,
                            conversations: page.conversations.map(conv =>
                                conv.id === conversationId
                                    ? { ...conv, crm_lead_name: lead?.name ?? null }
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
    });

    return { attachLead, isPending };
}
