import formatMinutesToDuration from './formatMinutesToDuration';

/** `2h 20m`; a zero duration reads `0h` rather than `0h 0m`. */
export default function formatHoursMinutes(totalMinutes: number): string {
    const { hours, mins } = formatMinutesToDuration(totalMinutes);
    if (hours === 0 && mins === 0) return '0h';
    return `${hours}h ${mins}m`;
}
