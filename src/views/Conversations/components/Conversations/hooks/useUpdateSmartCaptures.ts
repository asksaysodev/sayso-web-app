import { InfiniteData, QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';
import * as Sentry from '@sentry/react';
import { updateConversationSmartCaptures } from '../../../services/updateConversation';
import type { ConversationSmartCapture, GetConversationsResponse } from '@/types/coach';
import { CONVERSATIONS_QUERY_KEY } from '../../../queryKeys';

interface UpdateSmartCapturesParams {
    conversationId: string;
    captures: Record<string, string>;
}

type ConversationsData = InfiniteData<GetConversationsResponse>;

function applyCaptures(
    current: ConversationSmartCapture[],
    conversationId: string,
    captures: Record<string, string>
): ConversationSmartCapture[] {
    const next = current.filter(sc => !(sc.topic in captures));
    for (const [topic, content] of Object.entries(captures)) {
        if (!content.trim()) continue;
        const existing = current.find(sc => sc.topic === topic);
        next.push(existing
            ? { ...existing, content }
            : { id: `optimistic-${topic}`, session_id: conversationId, topic, content, created_at: new Date().toISOString() });
    }
    return next;
}

function mapConversation(
    old: ConversationsData | undefined,
    conversationId: string,
    update: (smartCaptures: ConversationSmartCapture[]) => ConversationSmartCapture[]
): ConversationsData | undefined {
    if (!old) return old;
    return {
        ...old,
        pages: old.pages.map(page => ({
            ...page,
            conversations: page.conversations.map(conv =>
                conv.id === conversationId ? { ...conv, smart_captures: update(conv.smart_captures ?? []) } : conv
            ),
        })),
    };
}

/** Saves LPMAMA edits. Optimistic cache update, rollback on failure; the caller shows the error state. */
export default function useUpdateSmartCaptures() {
    const queryClient = useQueryClient();

    const { mutateAsync: updateSmartCaptures, isPending } = useMutation({
        mutationFn: ({ conversationId, captures }: UpdateSmartCapturesParams) =>
            updateConversationSmartCaptures(conversationId, captures),
        onMutate: async ({ conversationId, captures }) => {
            await queryClient.cancelQueries({ queryKey: CONVERSATIONS_QUERY_KEY });
            const previousData = queryClient.getQueriesData<ConversationsData>({ queryKey: CONVERSATIONS_QUERY_KEY });
            queryClient.setQueriesData<ConversationsData>({ queryKey: CONVERSATIONS_QUERY_KEY }, old =>
                mapConversation(old, conversationId, current => applyCaptures(current, conversationId, captures))
            );
            return { previousData };
        },
        onSuccess: (smartCaptures, { conversationId }) => {
            queryClient.setQueriesData<ConversationsData>({ queryKey: CONVERSATIONS_QUERY_KEY }, old =>
                mapConversation(old, conversationId, () => smartCaptures)
            );
        },
        onError: (error, _variables, context) => {
            context?.previousData?.forEach(([key, data]: [QueryKey, ConversationsData | undefined]) => {
                queryClient.setQueryData(key, data);
            });
            Sentry.captureException(error);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: CONVERSATIONS_QUERY_KEY });
        },
    });

    return { updateSmartCaptures, isPending };
}
