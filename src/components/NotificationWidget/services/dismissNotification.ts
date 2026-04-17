import apiClient from "@/config/axios";
// import { CreatedNotification } from "@/views/Admin/types";

export default async function dismissNotification(notification_id: string): Promise<unknown> {
    const response = await apiClient.post(`/notifications/dismiss`, { notification_id });

    if (!response?.data) {
        throw new Error('Failed to dismiss notification');
    }

    return response.data;
}