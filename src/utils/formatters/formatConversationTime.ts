import formatMinutesToDuration from "./formatMinutesToDuration";

/**
 * Formats a total number of minutes as a human-readable conversation duration.
 * @param {number} minutes - Total minutes to format
 * @returns {string} Duration such as "54 min", "1h 43min" or "2h"
 * @example
 * formatConversationTime(54)  // "54 min"
 * formatConversationTime(103) // "1h 43min"
 * formatConversationTime(120) // "2h"
 */
export default function formatConversationTime(minutes: number): string {
    const { hours, mins } = formatMinutesToDuration(minutes);

    if (hours === 0) return `${mins} min`;
    if (mins === 0) return `${hours}h`;

    return `${hours}h ${mins}min`;
}
