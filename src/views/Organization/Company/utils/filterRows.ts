import type { CompanyMemberRow } from '../types';

/**
 * Case-insensitive search on full name + e-mail.
 * Invites have no name, so they match on e-mail only.
 */
export default function filterRows(
    rows: CompanyMemberRow[],
    text: string,
): CompanyMemberRow[] {
    const query = text.trim().toLowerCase();

    if (!query) return rows;

    return rows.filter((row) => {
        const fullName = `${row.name ?? ''} ${row.lastname ?? ''}`.toLowerCase();
        return fullName.includes(query) || row.email.toLowerCase().includes(query);
    });
}
