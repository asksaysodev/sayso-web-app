import apiClient from "@/config/axios";
import { CreatedNotification } from "../types";

export async function getNotificationsAdmin(): Promise<CreatedNotification[]> {
    const response = await apiClient.get(`/admin/notifications`);

    if (!response?.data) {
        throw new Error('Failed to get notifications');
    }

    return response.data.data;
}

export async function createNotification(data: Omit<CreatedNotification, 'id' | 'created_at'>): Promise<CreatedNotification> {
    const response = await apiClient.post(`/admin/notifications`, data);

    if (!response?.data) {
        throw new Error('Failed to create notification');
    }

    return response.data;
}

export async function updateNotification(id: string, data: Partial<CreatedNotification>): Promise<CreatedNotification> {
    const response = await apiClient.patch(`/admin/notifications/${id}`, data);

    if (!response?.data) {
        throw new Error('Failed to update notification');
    }

    return response.data;
}

export async function deleteNotification(id: string): Promise<unknown> {
    if (!id) return;
    const response = await apiClient.delete(`/admin/notifications/${id}`);

    if (!response?.data) {
        throw new Error('Failed to delete notification');
    }

    return response.data;
}
