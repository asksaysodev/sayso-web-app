/**
 * Converts a price in cents to a whole dollar amount.
 */
export default function centsToDollars(cents: number): number {
    return Math.round(cents / 100);
}
