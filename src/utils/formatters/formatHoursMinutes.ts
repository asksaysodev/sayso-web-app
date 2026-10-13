import formatMinutesToDuration from './formatMinutesToDuration';

export default function formatHoursMinutes(totalMinutes: number): string {
    const { hours, mins } = formatMinutesToDuration(totalMinutes);
    return `${hours}h ${mins}m`;
}
