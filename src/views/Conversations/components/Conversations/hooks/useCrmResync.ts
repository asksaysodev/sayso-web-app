import { useMutation } from '@tanstack/react-query';
import { resyncConversationCrm } from '../../../services/updateConversation';

/** Reposts the conversation's link note to its CRM lead. Resolves `true` only on `resync: 'ok'`. */
export default function useCrmResync() {
    const { mutateAsync, isPending } = useMutation({
        mutationFn: (conversationId: string) => resyncConversationCrm(conversationId),
    });

    const resync = async (conversationId: string): Promise<boolean> => {
        try {
            return (await mutateAsync(conversationId)) === 'ok';
        } catch {
            return false;
        }
    };

    return { resync, isPending };
}
