import { BadgeTone } from '@/components/ds/Badge';
import { AdminNotification, NotificationFormValues, NotificationStatus } from '../types';
import { fullAudience, isAudienceEmpty } from './audience';
import { centralToIso, isoToCentral, nextHourCentral } from './centralTime';

export const STATUS_BADGE: Record<NotificationStatus, { label: string; tone: BadgeTone }> = {
    draft: { label: 'Draft', tone: 'neutral' },
    scheduled: { label: 'Scheduled', tone: 'info' },
    sending: { label: 'Sending', tone: 'primary' },
    published: { label: 'Published', tone: 'success' },
    failed: { label: 'Failed', tone: 'error' },
    canceled: { label: 'Canceled', tone: 'neutral' },
};

/** Statuses whose in-app part is live (the send has started). */
export const LIVE_STATUSES: NotificationStatus[] = ['sending', 'published', 'failed'];

export const isLive = (n: AdminNotification) => LIVE_STATUSES.includes(n.status);
/** Draft and scheduled can change anything; live ones only their in-app part. */
export const isFullyEditable = (n: AdminNotification) => n.status === 'draft' || n.status === 'scheduled';
/** Legacy rows have no email: they were in-app only. */
export const hasEmail = (n: AdminNotification) => !!n.email_subject;

export const emptyForm = (now: Date = new Date()): NotificationFormValues => {
    const { date, time } = nextHourCentral(now);
    return {
        emailSubject: '',
        emailHtml: '',
        audience: fullAudience(),
        includeStaff: false,
        publishDate: date,
        publishTime: time,
        inAppEnabled: false,
        title: '',
        description: '',
        type: 'media',
        mediaUrls: [''],
        body: '',
        remindable: false,
        isWelcome: false,
        expiresDate: '',
    };
};

export const toFormValues = (n: AdminNotification): NotificationFormValues => {
    const base = emptyForm();
    const publish = n.publish_at ? isoToCentral(n.publish_at) : { date: base.publishDate, time: base.publishTime };
    return {
        emailSubject: n.email_subject ?? '',
        emailHtml: n.email_html ?? '',
        audience: n.audience ?? fullAudience(),
        includeStaff: n.include_staff,
        publishDate: publish.date,
        publishTime: publish.time,
        inAppEnabled: n.in_app_enabled,
        title: n.title ?? '',
        description: n.description ?? '',
        type: n.type ?? 'media',
        mediaUrls: n.media_url?.length ? n.media_url : [''],
        body: n.body ?? '',
        remindable: n.remindable,
        isWelcome: n.is_welcome,
        expiresDate: n.expires_at ? isoToCentral(n.expires_at).date : '',
    };
};

const inAppPayload = (v: NotificationFormValues) => ({
    title: v.title.trim() || null,
    description: v.description.trim() || null,
    type: v.type,
    media_url: v.type === 'media' ? v.mediaUrls.map(u => u.trim()).filter(Boolean) : null,
    body: v.type === 'article' ? v.body || null : null,
    remindable: v.remindable,
    is_welcome: v.isWelcome,
    expires_at: v.expiresDate ? centralToIso(v.expiresDate, '00:00') : null,
});

/** Everything, for a draft or scheduled notification. */
export const toPayload = (v: NotificationFormValues) => ({
    email_subject: v.emailSubject.trim(),
    email_html: v.emailHtml,
    audience: v.audience,
    include_staff: v.includeStaff,
    publish_at: v.publishDate ? centralToIso(v.publishDate, v.publishTime) : null,
    in_app_enabled: v.inAppEnabled,
    ...inAppPayload(v),
});

/** Only the in-app part, for a published notification (the email can't change). */
export const toInAppPayload = (v: NotificationFormValues) => inAppPayload(v);

const inAppProblems = (v: NotificationFormValues): string[] => {
    const problems: string[] = [];
    if (!v.title.trim()) problems.push('In-app title is required');
    if (v.type === 'media' && !v.mediaUrls.some(u => u.trim())) problems.push('Add at least one media URL');
    if (v.type === 'article' && (!v.body || v.body === '<p></p>')) problems.push('In-app body is required');
    return problems;
};

/**
 * What stops a Schedule or Send now, in the order a person would fix it. The server checks
 * the same things; this only keeps the buttons honest.
 */
export const publishProblems = (v: NotificationFormValues, { sendNow = false, now = new Date() } = {}): string[] => {
    const problems: string[] = [];
    if (!v.emailSubject.trim()) problems.push('Subject is required');
    if (!v.emailHtml.trim()) problems.push('Email HTML is required');
    if (isAudienceEmpty(v.audience, v.includeStaff)) problems.push('Pick at least one audience');
    if (!sendNow) {
        if (!v.publishDate || !v.publishTime) problems.push('Publish date and time are required');
        else if (new Date(centralToIso(v.publishDate, v.publishTime)).getTime() < now.getTime() - 5 * 60 * 1000) {
            problems.push('Publish date is in the past. Use Send now to send it now');
        }
    }
    if (v.inAppEnabled) problems.push(...inAppProblems(v));
    return problems;
};

/** For a published notification: only its in-app part is checked. */
export const liveEditProblems = (v: NotificationFormValues): string[] => (v.inAppEnabled ? inAppProblems(v) : []);
