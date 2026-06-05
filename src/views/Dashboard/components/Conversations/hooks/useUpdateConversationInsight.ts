import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import { updateInsight } from '../../../services/updateInsight';
import { InsightRating } from '../../../types';
import * as Sentry from '@sentry/react';
import { useToast } from '@/context/ToastContext';
import { GetConversationsResponse } from '@/types/coach';

export default function useUpdateConversationInsight() {
    const { showToast } = useToast();
    const queryClient = useQueryClient();

    const { mutate: updateInsightRating } = useMutation({
        mutationFn: ({ insightId, rating }: { insightId: string; rating: InsightRating }) =>
            updateInsight(insightId, rating),
        onMutate: async ({ insightId, rating }) => {
            await queryClient.cancelQueries({ queryKey: ['dashboard-conversations'] });

            const previousData = queryClient.getQueryData<InfiniteData<GetConversationsResponse>>(
                ['dashboard-conversations']
            );

            queryClient.setQueryData<InfiniteData<GetConversationsResponse>>(
                ['dashboard-conversations'],
                (old) => {
                    if (!old) return old;
                    return {
                        ...old,
                        pages: old.pages.map(page => ({
                            ...page,
                            conversations: page.conversations.map(conv => ({
                                ...conv,
                                insights: conv.insights.map(i =>
                                    i.id === insightId ? { ...i, rating } : i
                                ),
                            })),
                        })),
                    };
                }
            );

            return { previousData };
        },
        onError: (_error, _variables, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(['dashboard-conversations'], context.previousData);
            }
            showToast('error', 'Error updating insight rating');
            Sentry.captureException(_error);
        },
    });

    return { updateInsightRating };
}
