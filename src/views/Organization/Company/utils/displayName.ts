import type { CompanyMemberRow } from '../types';

/** Full name, or the e-mail for invites (they carry no name). */
export default function displayName(row: CompanyMemberRow): string {
    const fullName = `${row.name ?? ''} ${row.lastname ?? ''}`.trim();
    return fullName || row.email;
}
