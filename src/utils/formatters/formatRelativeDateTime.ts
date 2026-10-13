import dayjs, { type ConfigType, type Dayjs } from 'dayjs';

export default function formatRelativeDateTime(value: ConfigType, now: Dayjs = dayjs()): string {
    const date = dayjs(value);
    if (date.isSame(now, 'day')) return `Today, ${date.format('h:mm a')}`;
    if (date.isSame(now.subtract(1, 'day'), 'day')) return `Yesterday, ${date.format('h:mm a')}`;
    if (date.isSame(now, 'year')) return date.format('MMM D, h:mm a');
    return date.format('MMM D, YYYY');
}
