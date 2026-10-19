interface Named {
    name: string | null;
    lastname: string | null;
    email: string;
}

/** Full name, or the e-mail for invites (they carry no name). */
export default function displayName(row: Named): string {
    const fullName = `${row.name ?? ''} ${row.lastname ?? ''}`.trim();
    return fullName || row.email;
}
