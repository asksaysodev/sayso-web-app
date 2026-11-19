import apiClient from '@/config/axios';
import { AdminNotification, NotificationAction } from '../types';

export interface NotificationsList {
    notifications: AdminNotification[];
    /** Emails only reach the server's test list while true. */
    dryRun: boolean;
}

export async function getNotifications(): Promise<NotificationsList> {
    const response = await apiClient.get('/admin/notifications');
    const rows: AdminNotification[] | undefined = response?.data?.data;
    if (!Array.isArray(rows)) throw new Error('Failed to fetch notifications: unexpected response shape');
    return { notifications: rows, dryRun: response.data.dryRun === true };
}

export async function createNotification(action: NotificationAction, fields: object): Promise<AdminNotification> {
    const response = await apiClient.post('/admin/notifications', { action, ...fields });
    return response.data.data[0];
}

export async function updateNotification(
    id: string,
    action: NotificationAction,
    fields: object = {},
): Promise<AdminNotification> {
    const response = await apiClient.patch(`/admin/notifications/${id}`, { action, ...fields });
    return response.data.data[0];
}

export async function deleteNotification(id: string): Promise<void> {
    await apiClient.delete(`/admin/notifications/${id}`);
}

/** The email exactly as recipients get it, with the footer the server adds. */
export async function previewNotificationEmail(emailHtml: string): Promise<string> {
    const response = await apiClient.post('/admin/notifications/preview', { email_html: emailHtml });
    return response.data.html;
}

export async function sendNotificationTest(emailSubject: string, emailHtml: string): Promise<{ to: string }> {
    const response = await apiClient.post('/admin/notifications/test', {
        email_subject: emailSubject,
        email_html: emailHtml,
    });
    return response.data;
}
