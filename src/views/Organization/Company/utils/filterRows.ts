import type { CompanyMemberRow, CompanyMemberStatus } from '../types';

/**
 * Case-insensitive search on full name + e-mail, plus an optional status filter.
 * Invites have no name, so they match on e-mail only.
 */
export default function filterRows(
    rows: CompanyMemberRow[],
    text: string,
    status?: CompanyMemberStatus,
): CompanyMemberRow[] {
    const query = text.trim().toLowerCase();

    return rows.filter((row) => {
        if (status && row.status !== status) return false;
        if (!query) return true;
        const fullName = `${row.name ?? ''} ${row.lastname ?? ''}`.toLowerCase();
        return fullName.includes(query) || row.email.toLowerCase().includes(query);
    });
}
