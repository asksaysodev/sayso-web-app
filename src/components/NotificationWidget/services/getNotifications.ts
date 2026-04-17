import apiClient from "@/config/axios";
import { CreatedNotification } from "@/views/Admin/types";

export default async function getNotifications(): Promise<CreatedNotification[]> {
    const response = await apiClient.get(`/notifications`);

    if (!response?.data) {
        throw new Error('Failed to get notifications');
    }

    return response.data.data;
}