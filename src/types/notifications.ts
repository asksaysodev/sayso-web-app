export type NotificationType = 'media' | 'article';
export type NotificationStatus = 'active' | 'paused' | 'expired';

export type NotificationStatusFilter = { key: 'status'; value: NotificationStatus | 'all' };
export type NotificationTypeFilter   = { key: 'type';   value: NotificationType };
export type NotificationActiveFilter = NotificationStatusFilter | NotificationTypeFilter;

export interface CreatedNotification {
    id: string;
    created_at: string;
    title: string;
    description: string | null;
    type: NotificationType;
    media_url: string[] | null;
    body: string | null;
    remindable: boolean;
    is_welcome: boolean;
    active: boolean;
    expires_at: string | null;
}
