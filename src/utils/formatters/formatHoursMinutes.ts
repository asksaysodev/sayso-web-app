
export default function formatHoursMinutes(totalMinutes: number): string {
    const minutes = Math.max(0, Math.round(totalMinutes));
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}
