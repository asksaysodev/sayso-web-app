/**
 * Converts a total number of minutes into hours and remaining minutes.
 * @param {number} minutes - Total minutes to format
 * @returns {{ hours: number, mins: number }} Broken-down hours and leftover minutes
 * @example
 * formatMinutesToDuration(140) // { hours: 2, mins: 20 }
 */
export default function formatMinutesToDuration(minutes: number): { hours: number; mins: number } {
    if (!minutes || isNaN(minutes)) return { hours: 0, mins: 0};
    
    const total = Math.max(0, Math.floor(minutes));
    return {
        hours: Math.floor(total / 60),
        mins: total % 60,
    };
}
