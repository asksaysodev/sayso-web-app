import dayjs, { type Dayjs } from 'dayjs';

/**
 * Today / yesterday as words, any other day as a date:
 * "Today, 1:32 pm" · "Yesterday, 9:45 am" · "Aug 22, 7:54 pm" · "Aug 22, 2025" (older years).
 */
export default function formatLastConversation(iso: string | null, now: Dayjs = dayjs()): string {
    if (iso === null) return 'No conversations yet';

    const date = dayjs(iso);
    if (date.isSame(now, 'day')) return `Today, ${date.format('h:mm a')}`;
    if (date.isSame(now.subtract(1, 'day'), 'day')) return `Yesterday, ${date.format('h:mm a')}`;
    if (date.isSame(now, 'year')) return date.format('MMM D, h:mm a');
    return date.format('MMM D, YYYY');
}
