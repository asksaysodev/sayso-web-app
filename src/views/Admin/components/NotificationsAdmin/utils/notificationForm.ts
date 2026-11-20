import { BadgeTone } from '@/components/ds/Badge';
import { isWebLink } from '@/components/NotificationWidget/helpers/isWebLink';
import { toMediaItem } from '@/components/NotificationWidget/helpers/toMediaItem';
import { MediaItem } from '../../../types';
import { AdminNotification, MediaFormItem, NotificationFormValues, NotificationStatus } from '../types';
import { fullAudience, isAudienceEmpty } from './audience';
import { centralToIso, isoToCentral, nextHourCentral } from './centralTime';
import { contentProblems, newBlock, toEmailContent, toFormBlocks } from './emailContent';

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

let nextMediaId = 0;
export const emptyMediaItem = (url = '', previewUrl = ''): MediaFormItem => ({ id: `media-${++nextMediaId}`, url, previewUrl });

/** A preview only applies to web links; without one the item is stored as its URL. */
const toMediaPayload = (media: MediaFormItem[]): MediaItem[] =>
    media
        .map(({ url, previewUrl }) => ({ url: url.trim(), preview: previewUrl.trim() }))
        .filter(({ url }) => url)
        .map(({ url, preview }) => (preview && isWebLink(url) ? { url, preview_url: preview } : url));

const isHttpUrl = (value: string) => {
    try {
        return ['http:', 'https:'].includes(new URL(value).protocol);
    } catch {
        return false;
    }
};

export const emptyForm = (now: Date = new Date()): NotificationFormValues => {
    const { date, time } = nextHourCentral(now);
    return {
        emailSubject: '',
        emailTitle: '',
        emailBlocks: [newBlock('paragraph')],
        ctaLabel: '',
        ctaUrl: '',
        legacyHtml: '',
        audience: fullAudience(),
        includeStaff: false,
        publishDate: date,
        publishTime: time,
        inAppEnabled: false,
        title: '',
        description: '',
        type: 'media',
        media: [emptyMediaItem()],
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
        emailTitle: n.email_content?.title ?? '',
        emailBlocks: toFormBlocks(n.email_content),
        ctaLabel: n.email_content?.cta?.label ?? '',
        ctaUrl: n.email_content?.cta?.url ?? '',
        // Only kept while the builder is empty, so starting to build replaces the pasted HTML.
        legacyHtml: n.email_content ? '' : n.email_html ?? '',
        audience: n.audience ?? fullAudience(),
        includeStaff: n.include_staff,
        publishDate: publish.date,
        publishTime: publish.time,
        inAppEnabled: n.in_app_enabled,
        title: n.title ?? '',
        description: n.description ?? '',
        type: n.type ?? 'media',
        media: n.media_url?.length
            ? n.media_url.map(item => {
                const { url, previewUrl } = toMediaItem(item);
                return emptyMediaItem(url, previewUrl ?? '');
            })
            : [emptyMediaItem()],
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
    media_url: v.type === 'media' ? toMediaPayload(v.media) : null,
    body: v.type === 'article' ? v.body || null : null,
    remindable: v.remindable,
    is_welcome: v.isWelcome,
    expires_at: v.expiresDate ? centralToIso(v.expiresDate, '00:00') : null,
});

export const formEmailContent = (v: NotificationFormValues) =>
    toEmailContent(v.emailTitle, v.emailBlocks, v.ctaLabel, v.ctaUrl);

/** Whether the builder has anything in it (a pasted-HTML row stays as it is until it does). */
export const isBuilderEmpty = (v: NotificationFormValues) => {
    const content = formEmailContent(v);
    return !content.title && !content.blocks.length && !content.cta;
};

/** What preview and Send test render: the built email, or a row's pasted HTML. */
export const previewSource = (v: NotificationFormValues) =>
    v.legacyHtml && isBuilderEmpty(v) ? { email_html: v.legacyHtml } : { email_content: formEmailContent(v) };

/** Everything, for a draft or scheduled notification. */
export const toPayload = (v: NotificationFormValues) => ({
    email_subject: v.emailSubject.trim(),
    ...(v.legacyHtml && isBuilderEmpty(v) ? {} : { email_content: formEmailContent(v) }),
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
    if (v.type === 'media') {
        if (!v.media.some(m => m.url.trim())) problems.push('Add at least one media URL');
        v.media.forEach(({ url, previewUrl }, index) => {
            const n = index + 1;
            if (url.trim() && !isHttpUrl(url.trim())) problems.push(`Media URL ${n} isn't a valid link`);
            if (previewUrl.trim() && isWebLink(url.trim()) && !isHttpUrl(previewUrl.trim())) {
                problems.push(`Preview image ${n} isn't a valid link`);
            }
        });
    }
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
    if (!(v.legacyHtml && isBuilderEmpty(v))) problems.push(...contentProblems(formEmailContent(v)));
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
