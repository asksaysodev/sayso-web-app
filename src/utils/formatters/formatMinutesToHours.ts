/**
 * Formats minutes to hours
 * @param {number} minutes - The number of minutes to format
 * @returns {number} - The number of hours
 */
export default function formatMinutesToHours(minutes: number): number {
    if (!minutes || typeof minutes !== 'number') return 0;

    return minutes / 60;
}