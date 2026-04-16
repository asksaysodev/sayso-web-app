import apiClient from "@/config/axios";
import { CreatedNotification } from "@/views/Admin/types";

export default async function getDismissedNotifications(): Promise<CreatedNotification[]> {
    const response = await apiClient.get(`/notifications/dismissed`);

    if (!response?.data) {
        throw new Error('Failed to get dismissed notifications');
    }

    return response.data.data;
}