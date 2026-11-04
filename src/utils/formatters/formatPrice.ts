/**
 * Formats a dollar amount as a US-locale string with comma separators and no decimals (e.g. 1449 → "1,449").
 * With `keepCents`, fractional amounts keep two decimals (e.g. 124.9166 → "124.92") and whole ones stay bare.
 */
export default function formatPrice(amount: number, { keepCents = false }: { keepCents?: boolean } = {}): string {
    const rounded = Math.round(amount * 100) / 100;
    if (keepCents && !Number.isInteger(rounded)) {
        return rounded.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return amount.toLocaleString('en-US', { maximumFractionDigits: 0 });
}
