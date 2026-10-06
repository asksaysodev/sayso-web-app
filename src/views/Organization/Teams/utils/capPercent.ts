const MINUTES_PER_HOUR = 60;

/**
 * Percent of a cap used, truncated like the server's `capPercent` so a preview never disagrees
 * with what the server returns after saving. Unclamped: over the cap reads above 100.
 */
export default function capPercent(usedMinutes: number, hourCap: number): number {
    return Math.floor((usedMinutes / (hourCap * MINUTES_PER_HOUR)) * 100);
}
