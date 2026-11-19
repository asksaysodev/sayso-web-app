import { NotificationType } from '../../types';

export type NotificationStatus = 'draft' | 'scheduled' | 'sending' | 'published' | 'failed' | 'canceled';
export type AccountType = 'individual' | 'team' | 'no_plan';
export type AudienceRole = 'user' | 'admin' | 'owner';
/** Missing key = that account type is not in the audience. */
export type Audience = Partial<Record<AccountType, AudienceRole[]>>;
export type NotificationAction = 'save' | 'schedule' | 'send_now' | 'unschedule' | 'cancel';

/** A notification as GET /admin/notifications returns it (SAYSO-617). */
export interface AdminNotification {
    id: string;
    created_at: string;
    updated_at: string;
    status: NotificationStatus;
    publish_at: string | null;
    published_at: string | null;
    in_app_enabled: boolean;
    email_subject: string | null;
    email_html: string | null;
    /** null = created before audiences existed: in-app only, for everyone. */
    audience: Audience | null;
    include_staff: boolean;
    email_attempts: number;
    email_error: string | null;
    title: string | null;
    description: string | null;
    type: NotificationType | null;
    media_url: string[] | null;
    body: string | null;
    remindable: boolean;
    is_welcome: boolean;
    active: boolean;
    expires_at: string | null;
}

/** The form's state. Dates and times are Central Time strings, as the inputs hold them. */
export interface NotificationFormValues {
    emailSubject: string;
    emailHtml: string;
    audience: Audience;
    includeStaff: boolean;
    publishDate: string; // YYYY-MM-DD, CT
    publishTime: string; // HH:mm, CT
    inAppEnabled: boolean;
    title: string;
    description: string;
    type: NotificationType;
    mediaUrls: string[];
    body: string;
    remindable: boolean;
    isWelcome: boolean;
    expiresDate: string; // YYYY-MM-DD, CT; empty = never
}
