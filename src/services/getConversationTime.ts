import apiClient from "@/config/axios";
import { ConversationTime } from "@/types/user";

/**
 *
 * @returns {ConversationTime} - Total conversation minutes over the last 30 days
 */
export default async function getConversationTime(): Promise<ConversationTime> {
    const response = await apiClient.get('/accounts/conversation-time');

    if (!response?.data) {
        throw new Error('Failed to fetch conversation time');
    }

    return response?.data
}
