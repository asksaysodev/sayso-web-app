import { InfiniteData, QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';
import { updateInsight } from '../../../services/updateInsight';
import { InsightRating } from '../../../types';
import * as Sentry from '@sentry/react';
import { useToast } from '@/context/ToastContext';
import { GetConversationsResponse } from '@/types/coach';

const CONVERSATIONS_KEY = ['dashboard-conversations'];

export default function useUpdateConversationInsight() {
    const { showToast } = useToast();
    const queryClient = useQueryClient();

    const { mutate: updateInsightRating } = useMutation({
        mutationFn: ({ insightId, rating }: { insightId: string; rating: InsightRating }) =>
            updateInsight(insightId, rating),
        onMutate: async ({ insightId, rating }) => {
            await queryClient.cancelQueries({ queryKey: CONVERSATIONS_KEY });

            const previousData = queryClient.getQueriesData<InfiniteData<GetConversationsResponse>>({
                queryKey: CONVERSATIONS_KEY,
            });

            queryClient.setQueriesData<InfiniteData<GetConversationsResponse>>(
                { queryKey: CONVERSATIONS_KEY },
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
        onError: (error, _variables, context) => {
            context?.previousData?.forEach(([key, data]: [QueryKey, InfiniteData<GetConversationsResponse> | undefined]) => {
                queryClient.setQueryData(key, data);
            });
            showToast('error', 'Error updating insight rating');
            Sentry.captureException(error);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: CONVERSATIONS_KEY });
        },
    });

    return { updateInsightRating };
}
