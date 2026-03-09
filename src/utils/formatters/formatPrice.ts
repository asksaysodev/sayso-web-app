/**
 * Formats a dollar amount as a US-locale string with comma separators and no decimals (e.g. 1449 → "1,449").
 */
export default function formatPrice(amount: number): string {
    return amount.toLocaleString('en-US', { maximumFractionDigits: 0 });
}
