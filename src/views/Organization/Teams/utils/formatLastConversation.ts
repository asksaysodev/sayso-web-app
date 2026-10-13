import type { Dayjs } from 'dayjs';
import formatRelativeDateTime from '@/utils/formatters/formatRelativeDateTime';

/** A member's last conversation as relative date-time, or "No conversations yet". */
export default function formatLastConversation(iso: string | null, now?: Dayjs): string {
    if (iso === null) return 'No conversations yet';
    return formatRelativeDateTime(iso, now);
}
