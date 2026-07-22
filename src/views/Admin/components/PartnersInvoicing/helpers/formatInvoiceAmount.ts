export function formatInvoiceAmount(amountInCents: number, currency: string): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: (currency || 'usd').toUpperCase(),
    }).format((amountInCents ?? 0) / 100);
}
